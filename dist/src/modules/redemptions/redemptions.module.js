"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedemptionsModule = void 0;
const common_1 = require("@nestjs/common");
const redemptions_service_1 = require("./redemptions.service");
const redemptions_controller_1 = require("./redemptions.controller");
const prisma_module_1 = require("../../prisma/prisma.module");
const qr_security_module_1 = require("../qr-security/qr-security.module");
let RedemptionsModule = class RedemptionsModule {
};
exports.RedemptionsModule = RedemptionsModule;
exports.RedemptionsModule = RedemptionsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, qr_security_module_1.QRCodeSecurityModule],
        controllers: [redemptions_controller_1.RedemptionController],
        providers: [redemptions_service_1.RedemptionService],
        exports: [redemptions_service_1.RedemptionService],
    })
], RedemptionsModule);
//# sourceMappingURL=redemptions.module.js.map