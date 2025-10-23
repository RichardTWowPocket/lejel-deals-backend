import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MerchantsModule } from './modules/merchants/merchants.module';
import { CustomersModule } from './modules/customers/customers.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { DealsModule } from './modules/deals/deals.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AuthModule } from './modules/auth/auth.module';
import { PaymentModule } from './modules/payments/payment.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { StaffModule } from './modules/staff/staff.module';
import { QRCodeSecurityModule } from './modules/qr-security/qr-security.module';
import { RedemptionsModule } from './modules/redemptions/redemptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    MerchantsModule,
    CustomersModule,
    CategoriesModule,
    DealsModule,
    OrdersModule,
    AuthModule,
    PaymentModule,
    CouponsModule,
    AnalyticsModule,
    StaffModule,
    QRCodeSecurityModule,
    RedemptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
