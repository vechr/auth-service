import { AuditAuth, Session, Site, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export default class GetUserResponse implements User {
  id: string;

  username: string;

  fullName: string;

  emailAddress: string;

  description: string | null;

  phoneNumber: string | null;

  site: Site;

  @Exclude()
  sessions: Session;

  @Exclude()
  works: AuditAuth;

  @Exclude()
  siteId: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
