import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export default class ListUserResponse implements User {
  id: string;

  fullName: string;

  emailAddress: string;

  description: string | null;

  isCanLogin: boolean;

  username: string;

  @Exclude()
  siteId: string;

  phoneNumber: string | null;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
