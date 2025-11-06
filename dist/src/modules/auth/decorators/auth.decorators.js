"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantRoles = exports.Roles = exports.Public = exports.CurrentMerchantMembership = exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
exports.CurrentMerchantMembership = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.merchantMembership;
});
const Public = () => (0, common_1.SetMetadata)('isPublic', true);
exports.Public = Public;
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;
const MerchantRoles = (...roles) => (0, common_1.SetMetadata)('merchantRoles', roles);
exports.MerchantRoles = MerchantRoles;
//# sourceMappingURL=auth.decorators.js.map