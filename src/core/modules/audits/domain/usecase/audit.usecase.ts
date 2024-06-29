import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { OtelInstanceCounter, OtelMethodCounter } from 'nestjs-otel';
import { IContext } from '@/core/base/frameworks/shared/interceptors/context.interceptor';
import { publish } from '@/core/base/frameworks/shared/utils/nats.util';
import appConfig from '@/config/app.config';
import {
  AuditAction,
  TAuditCreatedPayload,
  TAuditDeletedPayload,
  TAuditUpdatedPayload,
  TAuditUpsertPayload,
} from '../entities/audit.entity';
import { TCompactAuthUser } from '@/core/base/domain/entities/auth.entity';

@Injectable()
@OtelInstanceCounter()
export default class AuditUseCase {
  constructor(@Inject('NATS_SERVICE') private readonly client: ClientProxy) {}

  @OtelMethodCounter()
  public async sendAudit(
    ctx: IContext,
    action: AuditAction,
    {
      id,
      prev,
      incoming,
      auditable,
    }: {
      id: string;
      prev?: Record<string, any>;
      incoming?: Record<string, any>;
      auditable?: string;
    },
  ) {
    // Test
    let topic = '';

    switch (action) {
      case AuditAction.CREATED:
        topic = appConfig.AUDIT_EVENT.CREATED;
        break;
      case AuditAction.UPDATED:
        topic = appConfig.AUDIT_EVENT.UPDATED;
        break;
      case AuditAction.DELETED:
        topic = appConfig.AUDIT_EVENT.DELETED;
        break;
      case AuditAction.UPSERT:
        topic = appConfig.AUDIT_EVENT.UPSERT;
      default:
        break;
    }

    if (topic) {
      await publish(this.client, topic, {
        auditable,
        auditableId: id,
        previous: prev || {},
        incoming: incoming || {},
        userId: (ctx.user as TCompactAuthUser).id,
        username: (ctx.user as TCompactAuthUser).name,
      } as
        | TAuditCreatedPayload
        | TAuditUpdatedPayload
        | TAuditDeletedPayload
        | TAuditUpsertPayload);
    }
  }
}
