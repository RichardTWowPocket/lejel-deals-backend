import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare enum UserRole {
    CUSTOMER = "customer",
    MERCHANT = "merchant",
    STAFF = "staff",
    ADMIN = "admin"
}
export declare class RolesGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
