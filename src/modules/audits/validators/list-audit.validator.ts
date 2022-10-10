import { ApiPropertyOptional } from '@nestjs/swagger';
import { AuditAuth, Prisma } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { TListAuditAuthRequestQuery } from '../requests/list-audit.request';
import { BaseQueryValidator, OperatorQuery } from '@/shared/types/query.type';

export class ListAuditAuthQueryField implements Prisma.AuditAuthWhereInput {
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
  @ApiPropertyOptional({ type: OperatorQuery })
  auditable?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  auditableId?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  previous?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  incoming?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  action?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  userId?: OperatorQuery;

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

export class ListAuditAuthQueryValidator extends BaseQueryValidator<AuditAuth> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListAuditAuthQueryField)
  @ApiPropertyOptional({ type: ListAuditAuthQueryField })
  field?: ListAuditAuthQueryField;
}

class FilterAuditAuthQueryValidator implements TListAuditAuthRequestQuery {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListAuditAuthQueryValidator)
  filters: ListAuditAuthQueryValidator;
}

export default class ListAuditAuthValidator {
  @IsObject()
  params: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => FilterAuditAuthQueryValidator)
  query: FilterAuditAuthQueryValidator;

  @IsObject()
  body: Record<string, any>;
}
