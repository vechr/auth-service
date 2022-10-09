import { Module } from '@nestjs/common';
import AuditAuthNatsController from './audit.nats';
import AuditAuthService from './audit.service';

@Module({
  controllers: [AuditAuthNatsController],
  providers: [AuditAuthService],
})
export default class AuditAuthModule {}
