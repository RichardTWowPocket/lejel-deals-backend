import { MerchantRole } from '@prisma/client';
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
export declare const CurrentMerchantMembership: (...dataOrPipes: unknown[]) => ParameterDecorator;
export declare const Public: () => import("@nestjs/common").CustomDecorator<string>;
export declare const Roles: (...roles: string[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const MerchantRoles: (...roles: MerchantRole[]) => import("@nestjs/common").CustomDecorator<string>;
