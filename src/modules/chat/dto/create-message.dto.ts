import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    example: 'Hello world!',
    description: 'Text of the sent message!',
  })
  @IsString({ message: 'Message must be a string!' })
  readonly message: string;

  @ApiProperty({ example: '1', description: 'Unique sender identifier' })
  @IsNumber()
  readonly senderId: number;

  @ApiProperty({ example: '1', description: 'Unique receiver identifier' })
  @IsNumber()
  readonly receiverId: number;

  @ApiProperty({
    example: 'false',
    description: 'Has message been delivered flag',
  })
  @IsBoolean()
  readonly hasdelivered: boolean;
}
