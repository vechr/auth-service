import { Prisma, Site } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { TListSiteRequestQuery } from '../requests/list-site.request';
import { BaseQueryValidator, OperatorQuery } from '@shared/types/query.type';

export class ListSiteQueryField implements Prisma.SiteWhereInput {
  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  id?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  code?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  @ApiPropertyOptional({ type: OperatorQuery })
  name?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  location?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  description?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  createdAt?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  updatedAt?: OperatorQuery;
}

export class ListSiteQueryValidator extends BaseQueryValidator<Site> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListSiteQueryField)
  @ApiPropertyOptional({ type: ListSiteQueryField })
  field?: ListSiteQueryField;
}

class FilterSiteQueryValidator implements TListSiteRequestQuery {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListSiteQueryValidator)
  filters: ListSiteQueryValidator;
}

export default class ListSiteValidator {
  @IsObject()
  params: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => FilterSiteQueryValidator)
  query: FilterSiteQueryValidator;

  @IsObject()
  body: Record<string, any>;
}
