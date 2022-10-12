import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsUUID, ValidateNested } from 'class-validator';

import { IDeleteSiteRequestParams } from '../requests/delete-site.request';

export class DeleteSiteParamsValidator implements IDeleteSiteRequestParams {
  @ApiProperty({
    example: 'aa15c44d-ad6b-4bf8-b3e1-ef188761105e',
    description: 'Insert your site id in Here!',
  })
  @IsUUID()
  id: string;
}

export default class DeleteSiteValidator {
  @ValidateNested()
  @IsObject()
  @Type(() => DeleteSiteParamsValidator)
  params: DeleteSiteParamsValidator;

  @IsObject()
  query: Record<string, any>;

  @IsObject()
  body: Record<string, any>;
}
