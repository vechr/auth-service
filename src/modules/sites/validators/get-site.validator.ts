import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsUUID, ValidateNested } from 'class-validator';

import { IGetSiteRequestParams } from '../requests/get-site.request';

export class GetSiteParamsValidator implements IGetSiteRequestParams {
  @ApiProperty({
    example: 'aa15c44d-ad6b-4bf8-b3e1-ef188761105e',
    description: 'Insert your site id in Here!',
  })
  @IsUUID()
  id: string;
}

export default class GetSiteValidator {
  @ValidateNested()
  @IsObject()
  @Type(() => GetSiteParamsValidator)
  params: GetSiteParamsValidator;

  @IsObject()
  query: Record<string, any>;

  @IsObject()
  body: Record<string, any>;
}
