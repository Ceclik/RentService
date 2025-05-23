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

interface PropertyImageCreationAttrs {
  imageUrl: string;
  propertyId: number;
}

@Table({ tableName: 'propertyImages' })
export class PropertyImage extends Model<
  PropertyImage,
  PropertyImageCreationAttrs
> {
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

  @ForeignKey(() => Property)
  @Column({ type: DataType.INTEGER, allowNull: false })
  propertyId: number;

  @BelongsTo(() => Property, { onDelete: 'CASCADE' })
  property: Property;
}
