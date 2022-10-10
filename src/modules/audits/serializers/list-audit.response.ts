import { AuditAction, AuditAuth, Prisma } from '@prisma/client';
import { Exclude } from 'class-transformer';

export default class ListAuditAuthResponse implements AuditAuth {
  id: string;

  auditable: string;

  auditableId: string;

  previous: Prisma.JsonValue;

  incoming: Prisma.JsonValue;

  action: AuditAction;

  userId: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
