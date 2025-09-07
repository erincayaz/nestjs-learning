import { User } from "src/users/domain/user";

export type JwtPayloadType = Pick<User, 'id' | 'role' | 'vendorId'> & {
  iat: number;
  exp: number;
}