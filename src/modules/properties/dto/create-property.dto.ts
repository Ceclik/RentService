import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyDto {
  @ApiProperty({
    example: 'One room apartment',
    description: 'Name of the property in ad',
  })
  readonly title: string;

  @ApiProperty({
    example: '?',
    description: 'Location of the property',
  })
  readonly location: string;

  @ApiProperty({ example: '157.8', description: 'Price for the month of rent' })
  readonly price: number;

  @ApiProperty({ example: '5', description: 'Id of type of the property' })
  readonly typeId: number;

  @ApiProperty({
    example: '1',
    description: 'Id of the owner account of the property',
  })
  readonly ownerId: number;
}
