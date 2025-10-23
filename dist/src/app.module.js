"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const merchants_module_1 = require("./modules/merchants/merchants.module");
const customers_module_1 = require("./modules/customers/customers.module");
const categories_module_1 = require("./modules/categories/categories.module");
const deals_module_1 = require("./modules/deals/deals.module");
const orders_module_1 = require("./modules/orders/orders.module");
const auth_module_1 = require("./modules/auth/auth.module");
const payment_module_1 = require("./modules/payments/payment.module");
const coupons_module_1 = require("./modules/coupons/coupons.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const staff_module_1 = require("./modules/staff/staff.module");
const qr_security_module_1 = require("./modules/qr-security/qr-security.module");
const redemptions_module_1 = require("./modules/redemptions/redemptions.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            merchants_module_1.MerchantsModule,
            customers_module_1.CustomersModule,
            categories_module_1.CategoriesModule,
            deals_module_1.DealsModule,
            orders_module_1.OrdersModule,
            auth_module_1.AuthModule,
            payment_module_1.PaymentModule,
            coupons_module_1.CouponsModule,
            analytics_module_1.AnalyticsModule,
            staff_module_1.StaffModule,
            qr_security_module_1.QRCodeSecurityModule,
            redemptions_module_1.RedemptionsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map