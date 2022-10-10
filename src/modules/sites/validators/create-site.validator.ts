import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ICreateSiteRequestBody } from '../requests/create-site.request';

export class CreateSiteBodyValidator implements ICreateSiteRequestBody {
  @ApiProperty({
    example: 'Site B',
    description: 'Insert your site name in Here!',
  })
  @IsString()
  code: string;

  @ApiProperty({
    example: 'STB',
    description: 'Insert your site code in Here!',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Jakarta',
    description: 'Insert your site location in Here!',
  })
  @IsString()
  location: string;

  @ApiProperty({
    example: 'This is Site Jakarta Description',
    description: 'Insert your site description in Here!',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export default class CreateSiteValidator {
  @IsObject()
  params: Record<string, any>;

  @IsObject()
  query: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => CreateSiteBodyValidator)
  body: CreateSiteBodyValidator;
}
