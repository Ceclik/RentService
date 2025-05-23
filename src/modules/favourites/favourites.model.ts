import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.model';
import { Property } from '../properties/properties.model';

interface FavouriteCreationAttrs {
  propertyId: number;
  clientId: number;
}

@Table({ tableName: 'favourites' })
export class Favourite extends Model<Favourite, FavouriteCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Property)
  @Column({ type: DataType.INTEGER, allowNull: false })
  propertyId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  clientId: number;

  @BelongsTo(() => Property, { onDelete: 'CASCADE' })
  property: Property;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  user: User;
}
