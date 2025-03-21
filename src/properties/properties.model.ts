import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.model';
import { Type } from '../types/types.model';
import { Description } from '../descriptions/descriptions.model';
import { PropertyImage } from '../descriptions/property-images.model';
import { Booking } from '../bookings/bookings.model';
import { Favourite } from '../favourites/favourites.model';
import { Review } from '../reviews/rewiews.model';
import { Analytics } from '../analytics/analytics.model';

interface PropertyCreationAttrs {
  title: string;
  location: string;
  price: number;
}

@Table({ tableName: 'properties' })
export class Property extends Model<Property, PropertyCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'One room apartment',
    description: 'Name of the property in ad',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({
    example: '?',
    description: 'Location of the property',
  })
  @Column({ type: DataType.JSON, allowNull: false })
  location: string;

  @ApiProperty({ example: '157.8', description: 'Price for the month of rent' })
  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0.0 })
  price: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  ownerId: number;

  @ForeignKey(() => Type)
  @Column({ type: DataType.INTEGER, allowNull: false })
  typeId: number;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  owner: User;

  @BelongsTo(() => Type)
  type: Type;

  @HasMany(() => Description)
  descriptions: Description[];

  @HasMany(() => PropertyImage)
  propertyImages: PropertyImage[];

  @HasMany(() => Booking)
  bookings: Booking[];

  @HasMany(() => Favourite)
  favourites: Favourite[];

  @HasMany(() => Review)
  reviews: Review[];

  @HasOne(() => Analytics)
  analytic: Analytics;
}
