import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SiteUseCase } from '../domain/usecase/site.usecase';
import {
  CreateSiteSerializer,
  DeleteSiteSerializer,
  GetSiteSerializer,
  ListSiteSerializer,
  UpdateSiteSerializer,
  UpsertSiteSerializer,
} from '@/modules/sites/domain/entities/site.serializer';
import {
  CreateSiteValidator,
  DeleteSiteBatchBodyValidator,
  DeleteSiteParamsValidator,
  FilterCursorSiteQueryValidator,
  FilterPaginationSiteQueryValidator,
  GetSiteParamsValidator,
  ListCursorSiteQueryValidator,
  ListPaginationSiteQueryValidator,
  UpdateSiteParamsValidator,
  UpdateSiteValidator,
  UpsertSiteValidator,
} from '@/modules/sites/domain/entities/site.validator';
import { ControllerFactory } from '@/core/base/infrastructure/factory.controller';
import { OtelInstanceCounter } from 'nestjs-otel';

@ApiTags('Site')
@OtelInstanceCounter()
@Controller('site')
export class SiteController extends ControllerFactory<
  UpsertSiteValidator,
  CreateSiteValidator,
  GetSiteParamsValidator,
  UpdateSiteValidator,
  UpdateSiteParamsValidator,
  DeleteSiteBatchBodyValidator,
  DeleteSiteParamsValidator
>(
  'site',
  'site',
  FilterPaginationSiteQueryValidator,
  FilterCursorSiteQueryValidator,
  ListSiteSerializer,
  ListPaginationSiteQueryValidator,
  ListCursorSiteQueryValidator,
  UpsertSiteSerializer,
  UpsertSiteValidator,
  CreateSiteSerializer,
  CreateSiteValidator,
  GetSiteSerializer,
  GetSiteParamsValidator,
  UpdateSiteSerializer,
  UpdateSiteValidator,
  UpdateSiteParamsValidator,
  DeleteSiteSerializer,
  DeleteSiteBatchBodyValidator,
  DeleteSiteParamsValidator,
) {
  constructor(public _usecase: SiteUseCase) {
    super();
  }
}
