import { AuditAction } from '@prisma/client';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TAuditUpdatedPayload } from './audit-updated.type';
import { TAuditCreatedPayload } from './types/audit-created.type';
import { TAuditDeletedPayload } from './types/audit-deleted.type';
import log from '@/shared/utils/log.util';
import PrismaService from '@/prisma/prisma.service';
import { IContext } from '@/shared/interceptors/context.interceptor';
import { publish } from '@/shared/utils/nats.util';
import { TUserCustomInformation } from '@/shared/types/user.type';

export default class AuditAuthService {
  constructor(
    private readonly db: PrismaService,
    @Inject('NATS_SERVICE') private readonly client: ClientProxy,
  ) {}

  public async created(payload: TAuditCreatedPayload): Promise<void> {
    const identifier = `${payload.auditable}:${payload.auditableId}@${AuditAction.CREATED}`;

    log.info(`attempt to audit for ${identifier}`);

    try {
      await this.store(AuditAction.CREATED, payload);

      log.info(`successfully audited for ${identifier}`);
    } catch (error) {
      log.error(`error while auditing for ${identifier}`, error);
    }
  }

  public async updated(payload: TAuditUpdatedPayload): Promise<void> {
    const identifier = `${payload.auditable}:${payload.auditableId}@${AuditAction.UPDATED}`;

    log.info(`attempt to audit for ${identifier}`);

    try {
      await this.store(AuditAction.UPDATED, payload);

      log.info(`successfully audited for ${identifier}`);
    } catch (error) {
      log.error(`error while auditing for ${identifier}`, error);
    }
  }

  public async deleted(payload: TAuditDeletedPayload): Promise<void> {
    const identifier = `${payload.auditable}:${payload.auditableId}@${AuditAction.DELETED}`;

    log.info(`attempt to audit for ${identifier}`);

    try {
      await this.store(AuditAction.DELETED, payload);

      log.info(`successfully audited for ${identifier}`);
    } catch (error) {
      log.error(`error while auditing for ${identifier}`, error);
    }
  }

  private async store(
    action: AuditAction,
    payload: TAuditCreatedPayload | TAuditUpdatedPayload | TAuditDeletedPayload,
  ): Promise<void> {
    await this.db.auditAuth.create({
      data: {
        auditable: payload.auditable,
        auditableId: payload.auditableId,
        previous: payload.previous || {},
        incoming: payload.incoming || {},
        action,
        userId: payload.userId,
      },
    });
  }

  public async sendAudit(
    ctx: IContext,
    action: AuditAction,
    {
      id,
      prev,
      incoming,
    }: {
      id: string;
      prev?: Record<string, any>;
      incoming?: Record<string, any>;
    },
  ) {
    let topic = '';

    switch (action) {
      case AuditAction.CREATED:
        topic = 'auth.audit.created';
        break;
      case AuditAction.UPDATED:
        topic = 'auth.audit.updated';
        break;
      case AuditAction.DELETED:
        topic = 'auth.audit.deleted';
        break;
      default:
        break;
    }

    if (topic) {
      await publish(this.client, topic, {
        auditable: 'site',
        auditableId: id,
        previous: prev || {},
        incoming: incoming || {},
        userId: (ctx.user as TUserCustomInformation).id,
      } as TAuditCreatedPayload);
    }
  }
}
