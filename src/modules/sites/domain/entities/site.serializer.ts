import { Site } from './site.entity';

export class ListSiteSerializer implements Site {
  code: string;
  location: string;
  name: string;
  description: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateSiteSerializer implements Site {
  code: string;
  location: string;
  name: string;
  description: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
export class UpsertSiteSerializer extends CreateSiteSerializer {}
export class UpdateSiteSerializer extends CreateSiteSerializer {}
export class DeleteSiteSerializer extends CreateSiteSerializer {}
export class GetSiteSerializer extends CreateSiteSerializer {}
