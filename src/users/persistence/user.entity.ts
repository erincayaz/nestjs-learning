import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { VendorEntity } from 'src/vendors/persistence/vendor.entity';
import { RoleEnum } from '../../roles/role.enum';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class UserEntity extends Model<UserEntity> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM(...Object.values(RoleEnum)),
    allowNull: false,
  })
  declare role: RoleEnum;

  @ForeignKey(() => VendorEntity)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare vendorId?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare updatedAt: Date;
}
