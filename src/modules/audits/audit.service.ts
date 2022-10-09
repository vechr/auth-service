import { AuditAction } from '@prisma/client';
import { TAuditUpdatedPayload } from './audit-updated.type';
import { TAuditCreatedPayload } from './types/audit-created.type';
import { TAuditDeletedPayload } from './types/audit-deleted.type';
import log from '@/shared/utils/log.util';
import PrismaService from '@/prisma/prisma.service';

export default class AuditAuthService {
  constructor(private readonly db: PrismaService) {}

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
}
