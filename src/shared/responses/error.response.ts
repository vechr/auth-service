import BaseResponse from './base.response';

export interface IErrorResponse {
  code: string;
  message: string;
  params: Record<string, any>;
}

export default class ErrorResponse extends BaseResponse {
  constructor(public message: string, error: IErrorResponse) {
    super(false, message, null, error, {});
  }
}
