export interface ICreateRoleRequestBody {
  name: string;
  description?: string;
  permissions: string[];
}
