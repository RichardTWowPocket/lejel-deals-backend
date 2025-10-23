"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCodeSecurityModule = void 0;
const common_1 = require("@nestjs/common");
const qr_security_service_1 = require("./qr-security.service");
const qr_security_controller_1 = require("./qr-security.controller");
const prisma_module_1 = require("../../prisma/prisma.module");
let QRCodeSecurityModule = class QRCodeSecurityModule {
};
exports.QRCodeSecurityModule = QRCodeSecurityModule;
exports.QRCodeSecurityModule = QRCodeSecurityModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [qr_security_controller_1.QRCodeSecurityController],
        providers: [qr_security_service_1.QRCodeSecurityService],
        exports: [qr_security_service_1.QRCodeSecurityService],
    })
], QRCodeSecurityModule);
//# sourceMappingURL=qr-security.module.js.map