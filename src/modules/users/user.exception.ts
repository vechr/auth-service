import { BadRequestException, NotFoundException } from '@shared/exceptions/common.exception';

export enum ESiteErrorCode {
  USER_NOT_FOUND = '404',
  BAD_REQUEST = '401',
}

class UserNotFound extends NotFoundException {
  constructor(params: { id: string }) {
    super({
      message: 'user not found',
      code: ESiteErrorCode.USER_NOT_FOUND,
      params,
    });
  }
}

class DuplicateUser extends NotFoundException {
  constructor(params: { username: string }) {
    super({
      message: 'duplicate user identifier',
      code: ESiteErrorCode.BAD_REQUEST,
      params,
    });
  }
}

class PasswordIsNotMatch extends BadRequestException {
  constructor(params: { message: string }) {
    super({
      message: "password doesn't matches",
      code: ESiteErrorCode.BAD_REQUEST,
      params,
    });
  }
}

export default {
  PasswordIsNotMatch,
  UserNotFound,
  DuplicateUser,
};
