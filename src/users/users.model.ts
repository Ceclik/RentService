import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '../roles/user-roles.model';
import { Role } from '../roles/roles.model';
import { Property } from '../properties/properties.model';
import { Booking } from '../bookings/bookings.model';

interface UserCreationAttrs {
  email: string;
  password: string;
  oauth_id: string;
  oauth_provider: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: '123@gmail.com',
    description: 'email identifier of the user',
  })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({
    example: '134iu2p3f2pfpoiqj-490rjqqei',
    description: 'Hashed users password',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({ example: 'false', description: 'Is user banned flag' })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  banned: boolean;

  @ApiProperty({
    example: 'Publishing scam offers',
    description: 'Reason why user has been banned',
  })
  @Column({ type: DataType.STRING })
  ban_reason: string;

  @ApiProperty({
    example: '1',
    description:
      'oauth provider if user has been registered using google, Facebook, etc.',
  })
  @Column({ type: DataType.STRING })
  oauth_provider: string;

  @ApiProperty({ example: '1', description: 'oauth id' })
  @Column({ type: DataType.STRING })
  oauth_id: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @HasMany(() => Property)
  property: Property[];

  @HasMany(() => Booking)
  bookings: Booking[];
}
