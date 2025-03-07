import { ApiProperty } from '@nestjs/swagger';

export class CreateDescriptionDto {
  @ApiProperty({
    example: 'Amount of rooms',
    description: 'Name of the description of the property',
  })
  readonly title: string;

  @ApiProperty({
    example: '4',
    description: 'Value of the description of the property',
  })
  readonly description: string;

  @ApiProperty({
    example: '5',
    description: 'Id of property of the description',
  })
  readonly propertyId: number;
}
