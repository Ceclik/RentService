import { ApiProperty } from '@nestjs/swagger';
import { ReceiveDescriptionDto } from '../../descriptions/dto/receive-description.dto';
import { IsNumber, IsString } from 'class-validator';

export class ReceivePropertyDto {
  @ApiProperty({
    example: 'One room apartment',
    description: 'Name of the property in ad',
  })
  @IsString({ message: 'Title must be a string!' })
  readonly title: string;

  @ApiProperty({
    example: '?',
    description: 'Location of the property',
  })
  readonly location: string;

  @ApiProperty({ example: '157.8', description: 'Price for the month of rent' })
  @IsNumber({}, { message: 'Price must be a number!' })
  readonly price: number;

  @ApiProperty({ example: '5', description: 'Id of type of the property' })
  @IsNumber()
  readonly typeId: number;

  @ApiProperty({ example: '5', description: 'Id of type of the property' })
  readonly descriptions: ReceiveDescriptionDto[];
}
