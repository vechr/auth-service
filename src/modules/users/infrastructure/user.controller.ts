import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserUseCase } from '../domain/usecase/user.usecase';
import SuccessResponse from '@/core/base/frameworks/shared/responses/success.response';
import {
  CreateUserSerializer,
  DeleteUserSerializer,
  GetUserSerializer,
  ListUserSerializer,
  UpdateUserSerializer,
  UpsertUserSerializer,
} from '@/modules/users/domain/entities/user.serializer';
import Serializer from '@/core/base/frameworks/shared/decorators/serializer.decorator';
import {
  CreateUserValidator,
  DeleteUserBatchBodyValidator,
  DeleteUserParamsValidator,
  FilterCursorUserQueryValidator,
  FilterPaginationUserQueryValidator,
  GetUserParamsValidator,
  ListCursorUserQueryValidator,
  ListPaginationUserQueryValidator,
  UpdateUserParamsValidator,
  UpdateUserValidator,
  UpsertUserValidator,
} from '@/modules/users/domain/entities/user.validator';
import Authentication from '@/core/base/frameworks/shared/decorators/authentication.decorator';
import Authorization from '@/core/base/frameworks/shared/decorators/authorization.decorator';
import User from '@/core/base/frameworks/shared/decorators/user.decorator';
import { TCompactAuthUser } from '@/core/base/domain/entities/auth.entity';
import { ControllerFactory } from '@/core/base/infrastructure/factory.controller';
import {
  EErrorCommonCode,
  UnknownException,
} from '@/core/base/frameworks/shared/exceptions/common.exception';
import Context from '@/core/base/frameworks/shared/decorators/context.decorator';
import { IContext } from '@/core/base/frameworks/shared/interceptors/context.interceptor';

@ApiTags('User')
@Controller('user')
export class UserController extends ControllerFactory<
  UpsertUserValidator,
  CreateUserValidator,
  GetUserParamsValidator,
  UpdateUserValidator,
  UpdateUserParamsValidator,
  DeleteUserBatchBodyValidator,
  DeleteUserParamsValidator
>(
  'user',
  'user',
  FilterPaginationUserQueryValidator,
  FilterCursorUserQueryValidator,
  ListUserSerializer,
  ListPaginationUserQueryValidator,
  ListCursorUserQueryValidator,
  UpsertUserSerializer,
  UpsertUserValidator,
  CreateUserSerializer,
  CreateUserValidator,
  GetUserSerializer,
  GetUserParamsValidator,
  UpdateUserSerializer,
  UpdateUserValidator,
  UpdateUserParamsValidator,
  DeleteUserSerializer,
  DeleteUserBatchBodyValidator,
  DeleteUserParamsValidator,
) {
  constructor(public _usecase: UserUseCase) {
    super();
  }

  @Delete('/:id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete method, you can delete item by id',
  })
  @HttpCode(HttpStatus.CREATED)
  @Serializer(DeleteUserSerializer)
  @Authentication(true)
  @Authorization('users:delete@auth')
  public override async delete(
    @Context() ctx: IContext,
    @Param() params: DeleteUserParamsValidator,
  ): Promise<SuccessResponse> {
    if (ctx.user === undefined)
      throw new UnknownException({
        code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
        message: `Current user cannot be found, please try to login first!`,
        params: { exception: ctx.user },
      });

    const result = await this._usecase.deleteWithCurrentUserCheck(ctx, params);

    return new SuccessResponse('user deleted successfully', result);
  }

  @Delete()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'Delete batch method, you can delete multiple items by multiple id',
  })
  @HttpCode(HttpStatus.CREATED)
  @Authentication(true)
  @Authorization('users:delete@auth')
  public override async deleteBatch(
    @Context() ctx: IContext,
    @Body() body: DeleteUserBatchBodyValidator,
    @User() currentUser?: TCompactAuthUser,
  ): Promise<SuccessResponse> {
    if (currentUser === undefined)
      throw new UnknownException({
        code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
        message: `Current user cannot be found, please try to login first!`,
        params: { exception: currentUser },
      });

    const result = await this._usecase.deleteBatchWithCurrentUserCheck(
      ctx,
      body,
    );

    return new SuccessResponse('user delete batched successfully', result);
  }
}
