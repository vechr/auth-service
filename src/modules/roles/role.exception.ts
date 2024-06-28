import { NotFoundException } from '@/core/base/frameworks/shared/exceptions/common.exception';

export enum ERoleErrorCode {
  ROLE_NOT_FOUND = '404',
  DUPLICATE_ROLE = '401',
}

class RoleNotFound extends NotFoundException {
  constructor(params: { id: string }) {
    super({
      message: 'Role not found!',
      code: ERoleErrorCode.ROLE_NOT_FOUND,
      params,
    });
  }
}

class DuplicateRole extends NotFoundException {
  constructor(params: { name: string }) {
    super({
      message: 'duplicate role identifier',
      code: ERoleErrorCode.DUPLICATE_ROLE,
      params,
    });
  }
}

export default {
  RoleNotFound,
  DuplicateRole,
};
