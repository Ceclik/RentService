import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Review } from './rewiews.model';

interface ReviewImageCreationAttrs {
  imageUrl: string;
  reviewId: number;
}

@Table({ tableName: 'reviewImages' })
export class ReviewImage extends Model<ReviewImage, ReviewImageCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: '?',
    description: 'Address of the image on server',
  })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  imageUrl: string;

  @ForeignKey(() => Review)
  @Column({ type: DataType.INTEGER, allowNull: false })
  reviewId: number;

  @BelongsTo(() => Review, { onDelete: 'CASCADE' })
  review: Review;
}
