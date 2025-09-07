import { Exclude } from "class-transformer";
import { RoleEnum } from "../../roles/role.enum";


export class User {
  id: string;

  email: string;

  @Exclude()
  password: string;

  role: RoleEnum;

  vendorId?: string;

  createdAt: Date;

  updatedAt: Date;
}