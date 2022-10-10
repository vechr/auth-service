export interface IUpdateUserRequestBody {
  fullName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  description?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  roles: string[];
  siteId: string;
}

export interface IUpdateUserRequestParams {
  id: string;
}
