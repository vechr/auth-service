import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export default class UserResponse implements User {
  id: string;

  username: string;

  fullName: string;

  emailAddress: string;

  description: string | null;

  phoneNumber: string | null;

  siteId: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
