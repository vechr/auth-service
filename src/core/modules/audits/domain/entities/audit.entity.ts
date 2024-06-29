export type TAuditCreatedPayload = {
  auditable: string;
  auditableId: string;
  previous?: Record<string, any>;
  incoming?: Record<string, any>;
  userId: string;
};

export type TAuditDeletedPayload = {
  auditable: string;
  auditableId: string;
  previous?: Record<string, any>;
  incoming?: Record<string, any>;
  userId: string;
};

export enum AuditAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  UPSERT = 'UPSERT',
}

export type TAuditUpdatedPayload = {
  auditable: string;
  auditableId: string;
  previous: Record<string, any>;
  incoming: Record<string, any>;
  userId: string;
};

export type TAuditUpsertPayload = {
  auditable: string;
  auditableId: string;
  previous: Record<string, any>;
  incoming: Record<string, any>;
  userId: string;
};
