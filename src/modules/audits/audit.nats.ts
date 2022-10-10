import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TAuditUpdatedPayload } from './audit-updated.type';
import AuditAuthService from './audit.service';
import { TAuditCreatedPayload } from './types/audit-created.type';
import { TAuditDeletedPayload } from './types/audit-deleted.type';

@Controller()
export default class AuditAuthNatsController {
  constructor(private readonly auditService: AuditAuthService) {}

  @EventPattern('auth.audit.created')
  public async created(
    @Payload() payload: TAuditCreatedPayload,
  ): Promise<void> {
    const result = await this.auditService.created(payload);
    return result;
  }

  @EventPattern('auth.audit.updated')
  public async updated(
    @Payload() payload: TAuditUpdatedPayload,
  ): Promise<void> {
    const result = await this.auditService.updated(payload);
    return result;
  }

  @EventPattern('auth.audit.deleted')
  public async deleted(
    @Payload() payload: TAuditDeletedPayload,
  ): Promise<void> {
    const result = await this.auditService.deleted(payload);
    return result;
  }
}
