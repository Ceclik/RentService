import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Property } from '../properties/properties.model';
import { User } from '../users/users.model';
import { Contract } from '../contracts/contracts.model';

interface BookingCreationAttrs {
  startDate: Date;
  endDate: Date;
  propertyId: number;
  clientId: number;
}

@Table({ tableName: 'bookings' })
export class Booking extends Model<Booking, BookingCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'confirmed',
    description: 'status of the booking',
  })
  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'pending' })
  status: string;

  @ApiProperty({
    example: '11.03.2025',
    description: 'Start date of the booking',
  })
  @Column({ type: DataType.DATE, allowNull: false })
  startDate: Date;

  @ApiProperty({
    example: '11.03.2025',
    description: 'End date of the booking',
  })
  @Column({ type: DataType.DATE, allowNull: false })
  endDate: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  clientId: number;

  @ForeignKey(() => Property)
  @Column({ type: DataType.INTEGER, allowNull: false })
  propertyId: number;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  user: User;

  @BelongsTo(() => Property, { onDelete: 'CASCADE' })
  property: Property;

  @HasOne(() => Contract)
  contract: Contract;
}
