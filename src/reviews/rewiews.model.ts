import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.model';
import { Property } from '../properties/properties.model';
import { ReviewImage } from './review-images.model';

interface ReviewCreationAttrs {
  rating: number;
  review: string;
  propertyId: number;
  clientId: number;
}

@Table({ tableName: 'reviews' })
export class Review extends Model<Review, ReviewCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: '4',
    description: 'Amount of stars user can give to an apartment',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  rating: number;

  @ApiProperty({
    example: 'Very good apartment, liked everything!',
    description: 'Content of the users review',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  review: string;

  @ForeignKey(() => Property)
  @Column({ type: DataType.INTEGER, allowNull: false })
  propertyId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  clientId: number;

  @BelongsTo(() => Property)
  property: Property;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  user: User;

  @HasMany(() => ReviewImage, { onDelete: 'CASCADE' })
  images: ReviewImage[];
}
