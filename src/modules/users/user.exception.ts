import {
  BadRequestException,
  NotFoundException,
} from '@shared/exceptions/common.exception';

export enum ESiteErrorCode {
  USER_NOT_FOUND = '404',
  DUPLICATE_USER = '401',
  PASSWORD_NOT_MATCH = '401',
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
  constructor(params: { email: string }) {
    super({
      message: 'duplicate user identifier',
      code: ESiteErrorCode.DUPLICATE_USER,
      params,
    });
  }
}

class PasswordIsNotMatch extends BadRequestException {
  constructor(params: { message: string }) {
    super({
      message: "password doesn't matches",
      code: ESiteErrorCode.PASSWORD_NOT_MATCH,
      params,
    });
  }
}

export default {
  PasswordIsNotMatch,
  UserNotFound,
  DuplicateUser,
};
