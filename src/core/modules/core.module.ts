import { Module } from '@nestjs/common';
import { SessionModule } from './sessions/session.module';
import AuditModule from './audits/audit.module';

@Module({
  imports: [SessionModule, AuditModule],
})
export class CoreModule {}
