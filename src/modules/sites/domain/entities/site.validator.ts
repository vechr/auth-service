import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Site, Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  TCreateSiteRequestBody,
  TListSiteRequestQuery,
  TUpdateSiteRequestBody,
  TUpsertSiteRequestBody,
} from './site.entity';
import {
  BaseCursorQueryValidator,
  BasePaginationQueryValidator,
  IListCursorRequest,
  IListPaginationRequest,
  ListQueryField,
} from '@/core/base/domain/entities';
import {
  CreateValidator,
  IDsValidator,
  UpdateValidator,
} from '@/core/base/domain/entities/validator.entity';

// For field filter in list whether cursor or pagination
export class ListSiteQueryField
  extends ListQueryField
  implements Prisma.SiteWhereInput {}

// Create filters class for Cursor Type
export class ListCursorSiteQueryValidator extends BaseCursorQueryValidator<Site> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListSiteQueryField)
  @ApiPropertyOptional({ type: ListSiteQueryField })
  field?: ListSiteQueryField;
}

// Create filters class for Pagination Type
export class ListPaginationSiteQueryValidator extends BasePaginationQueryValidator<Site> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListSiteQueryField)
  @ApiPropertyOptional({ type: ListSiteQueryField })
  field?: ListSiteQueryField;
}

// implement filter class for Cursor Type
export class FilterCursorSiteQueryValidator
  implements TListSiteRequestQuery<IListCursorRequest>
{
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListCursorSiteQueryValidator)
  filters: ListCursorSiteQueryValidator;
}

// implement filter class for Pagination Type
export class FilterPaginationSiteQueryValidator
  implements TListSiteRequestQuery<IListPaginationRequest>
{
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListPaginationSiteQueryValidator)
  filters: ListPaginationSiteQueryValidator;
}

export class CreateSiteValidator
  extends CreateValidator
  implements TCreateSiteRequestBody
{
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'ST1',
    description: 'Site Code!',
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Server Default',
    description: 'Site Location!',
  })
  location: string;
}

export class DeleteSiteBatchBodyValidator extends IDsValidator {}

export class UpsertSiteValidator
  extends CreateSiteValidator
  implements TUpsertSiteRequestBody {}

export class UpdateSiteValidator
  extends UpdateValidator
  implements TUpdateSiteRequestBody
{
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'ST1',
    description: 'Site Code!',
  })
  code: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Server Default',
    description: 'Site Location!',
  })
  location: string;
}
