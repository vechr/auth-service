export interface IUpdateRoleRequestBody {
  name?: string;
  description?: string;
  permissions: string[];
}

export interface IUpdateRoleRequestParams {
  id: string;
}
