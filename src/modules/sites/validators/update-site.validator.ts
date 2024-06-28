import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

import { IUpdateSiteRequestBody, IUpdateSiteRequestParams } from '../requests/update-site.request';

export class UpdateSiteBodyValidator implements IUpdateSiteRequestBody {
  @ApiProperty({
    example: 'Site B',
    description: 'Insert your site name in Here!',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'STB',
    description: 'Insert your site code in Here!',
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({
    example: 'Jakarta',
    description: 'Insert your site location in Here!',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    example: 'This is Site Jakarta Description',
    description: 'Insert your site description in Here!',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateSiteParamsValidator implements IUpdateSiteRequestParams {
  @ApiProperty({
    example: 'aa15c44d-ad6b-4bf8-b3e1-ef188761105e',
    description: 'Insert your site id in Here!',
  })
  @IsUUID()
  id: string;
}

export default class UpdateSiteValidator {
  @ValidateNested()
  @IsObject()
  @Type(() => UpdateSiteParamsValidator)
  params: UpdateSiteParamsValidator;

  @IsObject()
  query: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => UpdateSiteBodyValidator)
  body: UpdateSiteBodyValidator;
}
