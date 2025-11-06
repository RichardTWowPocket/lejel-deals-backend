import { Module } from '@nestjs/common';
import { RedemptionService } from './redemptions.service';
import { RedemptionController } from './redemptions.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { QRCodeSecurityModule } from '../qr-security/qr-security.module';

@Module({
  imports: [PrismaModule, QRCodeSecurityModule],
  controllers: [RedemptionController],
  providers: [RedemptionService],
  exports: [RedemptionService],
})
export class RedemptionsModule {}
