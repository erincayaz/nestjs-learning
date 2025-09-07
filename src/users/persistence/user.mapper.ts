import { CreationAttributes } from "sequelize";
import { User } from "../domain/user";
import { UserEntity } from "./user.entity";

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    raw = raw.get({ plain: true });
    const user = new User();
    user.id = raw.id;
    user.email = raw.email;
    user.password = raw.password;
    user.role = raw.role;
    user.vendorId = raw.vendorId;
    user.createdAt = raw.createdAt;
    user.updatedAt = raw.updatedAt;
    return user;
  }

  static toPersistence(user: User): CreationAttributes<UserEntity> {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      role: user.role,
      vendorId: user.vendorId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    } as CreationAttributes<UserEntity>;
  }
}