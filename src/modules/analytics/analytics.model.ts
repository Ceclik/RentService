import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Property } from '../properties/properties.model';

interface AnalyticsCreationAttrs {
  propertyId: number;
}

@Table({ tableName: 'analytics' })
export class Analytics extends Model<Analytics, AnalyticsCreationAttrs> {
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
    description: 'Amount of views that property has',
  })
  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 0 })
  views: number;

  @ApiProperty({
    example: '15',
    description: 'Amount of bookings that property has',
  })
  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 0 })
  bookings: number;

  @ApiProperty({
    example: '15432',
    description: 'Amount of money that property has given to its owner',
  })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  revenue: number;

  @ForeignKey(() => Property)
  @Column({ type: DataType.INTEGER, allowNull: false })
  propertyId: number;

  @BelongsTo(() => Property, { onDelete: 'CASCADE' })
  property: Property;
}
