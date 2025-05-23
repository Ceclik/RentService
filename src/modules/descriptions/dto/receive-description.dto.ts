import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReceiveDescriptionDto {
  @ApiProperty({
    example: 'Amount of rooms',
    description: 'Name of the description of the property',
  })
  @IsString({ message: 'Title must be a string!' })
  readonly title: string;

  @ApiProperty({
    example: '4',
    description: 'Value of the description of the property',
  })
  @IsString({ message: 'Description must be a string!' })
  readonly description: string;
}
