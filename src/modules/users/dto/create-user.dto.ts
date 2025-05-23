import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  constructor(
    email: string,
    password: string,
    oauthId: string,
    oauthProvider: string,
  ) {
    this.email = email;
    this.password = password;
    this.oauth_id = oauthId;
    this.oauth_provider = oauthProvider;
  }

  @ApiProperty({
    example: '123@gmail.com',
    description: 'email identifier of the user',
  })
  @IsString({ message: 'must be a string' })
  @IsEmail({}, { message: 'wrong email format' })
  readonly email: string;

  @ApiProperty({
    example: '12345678',
    description: 'Users password',
  })
  @IsString({ message: 'must be a string' })
  @Length(3, 15, {
    message: 'must be longer then 3 and shorter then 15 characters',
  })
  readonly password: string;

  @ApiProperty({ example: '1', description: 'oauth id' })
  readonly oauth_id: string;

  @ApiProperty({
    example: '1',
    description:
      'oauth provider if user has been registered using google, Facebook, etc.',
  })
  readonly oauth_provider: string;
}
