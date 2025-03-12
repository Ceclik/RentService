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
import { Booking } from '../bookings/bookings.model';

interface ContractCreationAttrs {
  totalPrice: number;
  bookingId: number;
  ownerId: number;
  clientId: number;
}

@Table({ tableName: 'contracts' })
export class Contract extends Model<Contract, ContractCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: '1453',
    description: 'Total price of the full time rent',
  })
  @Column({ type: DataType.FLOAT, allowNull: false })
  totalPrice: number;

  @ApiProperty({
    example: 'Payed',
    description: 'Status of the contract',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'Waiting for payment',
  })
  status: string;

  @ForeignKey(() => Booking)
  @Column({ type: DataType.INTEGER, allowNull: false })
  bookingId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  ownerId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  clientId: number;

  @BelongsTo(() => Booking)
  booking: Booking;

  @BelongsTo(() => User)
  user: User;
}
