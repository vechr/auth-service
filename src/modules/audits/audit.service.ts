import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TAuditCreatedPayload } from './types/audit-created.type';
import { TAuditUpdatedPayload } from './types/audit-updated.type';
import { TAuditDeletedPayload } from './types/audit-deleted.type';
import { AuditAction } from './types/audit-enum.type';
import { IContext } from '@/shared/interceptors/context.interceptor';
import { publish } from '@/shared/utils/nats.util';
import { TUserCustomInformation } from '@/shared/types/user.type';
import appConstant from '@/constants/app.constant';

export default class AuditService {
  constructor(@Inject('NATS_SERVICE') private readonly client: ClientProxy) {}

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
    let topic = '';

    switch (action) {
      case AuditAction.CREATED:
        topic = appConstant.AUDIT_EVENT.CREATED;
        break;
      case AuditAction.UPDATED:
        topic = appConstant.AUDIT_EVENT.UPDATED;
        break;
      case AuditAction.DELETED:
        topic = appConstant.AUDIT_EVENT.DELETED;
        break;
      default:
        break;
    }

    if (topic) {
      await publish(this.client, topic, {
        auditable,
        auditableId: id,
        previous: prev || {},
        incoming: incoming || {},
        userId: (ctx.user as TUserCustomInformation).id,
        username: (ctx.user as TUserCustomInformation).username,
      } as TAuditCreatedPayload | TAuditUpdatedPayload | TAuditDeletedPayload);
    }
  }
}
