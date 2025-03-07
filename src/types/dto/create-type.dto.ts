import { ApiProperty } from '@nestjs/swagger';

export class CreateTypeDto {
  @ApiProperty({
    example: 'Apartment',
    description: 'Name of the type of the property',
  })
  readonly title: string;
}
