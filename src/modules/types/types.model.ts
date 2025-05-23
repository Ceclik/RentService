import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Property } from '../properties/properties.model';

interface TypeCreationAttrs {
  title: string;
}

@Table({ tableName: 'types' })
export class Type extends Model<Type, TypeCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Apartment',
    description: 'Name of the type of the property',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @HasMany(() => Property)
  property: Property[];
}
