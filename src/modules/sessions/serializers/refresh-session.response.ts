import { Session } from '@prisma/client';
import { Exclude } from 'class-transformer';

export default class RefreshSessionResponse implements Session {
  id: string;

  @Exclude()
  userId: string;

  token: string;

  refresh: string;

  @Exclude()
  data: Record<string, any>;

  expiredAt: Date;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
