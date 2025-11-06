import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../prisma/prisma.service';
import { MerchantRole } from '@prisma/client';
import { AuthUser } from '../types';

/**
 * Merchant Role Guard
 * 
 * Checks if the authenticated user has the required merchant role
 * for the merchant they're trying to access.
 * 
 * Role hierarchy:
 * OWNER > ADMIN > MANAGER > SUPERVISOR > CASHIER
 */
@Injectable()
export class MerchantRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<MerchantRole[]>(
      'merchantRoles',
      [context.getHandler(), context.getClass()],
    );

    // If no merchant role requirement, allow access (other guards will handle authorization)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthUser = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // SUPER_ADMIN has global access
    if (user.role === 'SUPER_ADMIN') {
      return true;
    }

    // Get merchant ID from request (params, query, or body)
    let merchantId =
      request.params?.merchantId ||
      request.query?.merchantId ||
      request.body?.merchantId;

    // For "me" endpoints (e.g., /merchants/me/overview), if merchantId not in query,
    // get it from user's first merchant membership
    if (!merchantId) {
      const route = request.route?.path || '';
      if (route.includes('/me/')) {
        const membership = await this.prisma.merchantMembership.findFirst({
          where: { userId: user.id },
          orderBy: { createdAt: 'asc' },
        });
        if (membership) {
          merchantId = membership.merchantId;
        }
      }
    }

    // If still no merchantId found, try to get it from user's merchantIds (JWT token)
    // or from their first merchant membership
    // This handles cases like /orders/stats where there's no merchant ID in the route
    if (!merchantId && user.merchantIds && user.merchantIds.length > 0) {
      // If user has only one merchant, use it
      if (user.merchantIds.length === 1) {
        merchantId = user.merchantIds[0];
      } else {
        // If user has multiple merchants, get the first active membership
        const membership = await this.prisma.merchantMembership.findFirst({
          where: {
            userId: user.id,
            merchantId: { in: user.merchantIds },
          },
          include: {
            merchant: {
              select: {
                id: true,
                isActive: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        });
        if (membership && membership.merchant?.isActive) {
          merchantId = membership.merchantId;
        }
      }
    }

    // Last resort: get first merchant membership from database
    if (!merchantId) {
      const membership = await this.prisma.merchantMembership.findFirst({
        where: { userId: user.id },
        include: {
          merchant: {
            select: {
              id: true,
              isActive: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });
      if (membership && membership.merchant?.isActive) {
        merchantId = membership.merchantId;
      }
    }

    // If merchantId not found but we have a deal/order/redemption ID,
    // query the entity to get merchantId
    if (!merchantId && request.params?.id) {
      const entityId = request.params.id;
      const route = request.route?.path || '';

      // For deals, orders, redemptions, staff - query to get merchantId
      if (route.includes('/deals/')) {
        const deal = await this.prisma.deal.findUnique({
          where: { id: entityId },
          select: { merchantId: true },
        });
        if (deal) merchantId = deal.merchantId;
      } else if (route.includes('/orders/')) {
        const order = await this.prisma.order.findUnique({
          where: { id: entityId },
          include: {
            deal: {
              select: {
                merchantId: true,
              },
            },
          },
        });
        if (order?.deal) {
          merchantId = order.deal.merchantId;
        }
      } else if (route.includes('/redemptions/')) {
        const redemption = await this.prisma.redemption.findUnique({
          where: { id: entityId },
          include: {
            coupon: {
              include: {
                deal: {
                  select: {
                    merchantId: true,
                  },
                },
              },
            },
          },
        });
        if (redemption?.coupon?.deal) {
          merchantId = redemption.coupon.deal.merchantId;
        }
      } else if (route.includes('/staff/')) {
        // For staff endpoints, get merchantId from staff member's MerchantMembership
        // Note: staff members are stored as MerchantMembership, not a separate Staff model
        // The entityId here is the userId (staff member's user ID)
        const membership = await this.prisma.merchantMembership.findFirst({
          where: { userId: entityId },
          select: { merchantId: true },
        });
        if (membership) {
          merchantId = membership.merchantId;
        }
      }
    }

    if (!merchantId) {
      throw new ForbiddenException(
        'Merchant ID is required to check merchant role access',
      );
    }

    // Get user's merchant membership for this merchant
    const membership = await this.prisma.merchantMembership.findFirst({
      where: {
        userId: user.id,
        merchantId: merchantId,
      },
      include: {
        merchant: {
          select: {
            id: true,
            isActive: true,
          },
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        'You do not have access to this merchant',
      );
    }

    if (!membership.merchant?.isActive) {
      throw new ForbiddenException('Merchant is not active');
    }

    const userMerchantRole = membership.merchantRole;

    // Check if user has one of the required roles
    // Using role hierarchy: higher roles have access to lower role permissions
    const hasAccess = requiredRoles.some((requiredRole) =>
      this.hasRoleAccess(userMerchantRole, requiredRole),
    );

    if (!hasAccess) {
      throw new ForbiddenException(
        `Required merchant role: ${requiredRoles.join(' or ')}. Your role: ${userMerchantRole}`,
      );
    }

    // Attach membership to request for use in controllers
    request.merchantMembership = membership;

    return true;
  }

  /**
   * Check if userRole has access equivalent to requiredRole
   * Higher roles have access to lower role permissions
   */
  private hasRoleAccess(
    userRole: MerchantRole,
    requiredRole: MerchantRole,
  ): boolean {
    const roleHierarchy: Record<MerchantRole, number> = {
      [MerchantRole.OWNER]: 5,
      [MerchantRole.ADMIN]: 4,
      [MerchantRole.MANAGER]: 3,
      [MerchantRole.SUPERVISOR]: 2,
      [MerchantRole.CASHIER]: 1,
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }
}
