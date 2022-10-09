import { Site } from '@prisma/client';
import { Exclude } from 'class-transformer';

export default class GetSiteResponse implements Site {
  id: string;

  code: string;

  name: string;

  location: string;

  description: string | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
