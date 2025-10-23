import { Module } from '@nestjs/common';
import { QRCodeSecurityService } from './qr-security.service';
import { QRCodeSecurityController } from './qr-security.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [QRCodeSecurityController],
  providers: [QRCodeSecurityService],
  exports: [QRCodeSecurityService],
})
export class QRCodeSecurityModule {}



