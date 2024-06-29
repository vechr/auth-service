import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionUseCase } from '../domain/usecase/permission.usecase';
import SuccessResponse from '@/core/base/frameworks/shared/responses/success.response';
import {
  GetPermissionSerializer,
  ListPermissionSerializer,
} from '@/modules/permissions/domain/entities/permission.serializer';
import Serializer from '@/core/base/frameworks/shared/decorators/serializer.decorator';
import {
  FilterCursorPermissionQueryValidator,
  FilterPaginationPermissionQueryValidator,
  GetPermissionParamsValidator,
  ListCursorPermissionQueryValidator,
  ListPaginationPermissionQueryValidator,
} from '@/modules/permissions/domain/entities/permission.validator';
import UseList from '@/core/base/frameworks/shared/decorators/uselist.decorator';
import { ApiFilterQuery } from '@/core/base/frameworks/shared/decorators/api-filter-query.decorator';
import Context from '@/core/base/frameworks/shared/decorators/context.decorator';
import { IContext } from '@/core/base/frameworks/shared/interceptors/context.interceptor';
import Authentication from '@/core/base/frameworks/shared/decorators/authentication.decorator';
import Authorization from '@/core/base/frameworks/shared/decorators/authorization.decorator';
import { OtelInstanceCounter } from 'nestjs-otel';

@ApiTags('Permission')
@OtelInstanceCounter()
@Controller('permission')
export class PermissionController {
  test: string;
  constructor(private _usecase: PermissionUseCase) {}

  @Get('all')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Special case for Permission',
  })
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('permission:read@auth')
  public async allPermissions() {
    const result = await this._usecase.allPermissions();

    return new SuccessResponse('permission fetched successfully', result);
  }

  @Get('')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'Dropdown method, you can get list of items with return id and name only',
  })
  @HttpCode(HttpStatus.OK)
  @Authentication(true)
  @Authorization('permission:read@auth')
  @ApiQuery({ name: 'search', type: String, required: false })
  public async listDropdown(@Context() ctx: IContext) {
    const result = await this._usecase.listDropdown(ctx);

    return new SuccessResponse('permission fetched successfully', result);
  }

  @Get('pagination')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'List pagination method, you can get list of items using page next or previous',
  })
  @HttpCode(HttpStatus.OK)
  @UseList(FilterPaginationPermissionQueryValidator)
  @Serializer(ListPermissionSerializer)
  @ApiFilterQuery('filters', ListPaginationPermissionQueryValidator)
  @Authentication(true)
  @Authorization('permission:read@auth')
  public async listPagination(@Context() ctx: IContext) {
    const { result, meta } = await this._usecase.listPagination(ctx);

    return new SuccessResponse('permission fetched successfully', result, meta);
  }

  @Get('cursor')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'List cursor method, you can get list of items using cursor or infinite scrolling',
  })
  @HttpCode(HttpStatus.OK)
  @UseList(FilterCursorPermissionQueryValidator)
  @Serializer(ListPermissionSerializer)
  @ApiFilterQuery('filters', ListCursorPermissionQueryValidator)
  @Authentication(true)
  @Authorization('permission:read@auth')
  public async listCursor(@Context() ctx: IContext) {
    const { meta, result } = await this._usecase.listCursor(ctx);

    return new SuccessResponse('permission fetched successfully', result, meta);
  }

  @Get('/:id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get by id method, you can get items by id',
  })
  @HttpCode(HttpStatus.OK)
  @Serializer(GetPermissionSerializer)
  @Authentication(true)
  @Authorization('permission:read@auth')
  public async get(
    @Context() ctx: IContext,
    @Param() params: GetPermissionParamsValidator,
  ) {
    const result = await this._usecase.getById(ctx, params);

    return new SuccessResponse('permission fetched successfully', result);
  }
}
