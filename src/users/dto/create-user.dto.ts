import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: '123@gmail.com',
    description: 'email identifier of the user',
  })
  readonly email: string;

  @ApiProperty({
    example: '12345678',
    description: 'Users password',
  })
  readonly password: string;

  @ApiProperty({ example: '1', description: 'oauth id' })
  readonly oauthId: string;

  @ApiProperty({
    example: '1',
    description:
      'oauth provider if user has been registered using google, Facebook, etc.',
  })
  readonly oauthProvider: string;
}
