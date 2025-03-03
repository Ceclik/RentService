export class CreateUserDto {
  readonly email: string;
  readonly password: string;
  readonly oauthId: string;
  readonly oauthProvider: string;
}
