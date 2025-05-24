import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.model';
import { context, CONTEXT_KEYS } from '@common/cls/request-context';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: CreateUserDto) {
    const user = await this.userService.getUsersByEmail(dto.email);
    if (!user)
      throw new HttpException(
        'No user with such email',
        HttpStatus.BAD_REQUEST,
      );

    if (user.password === '' && user.oauth_provider === 'google')
      return this.generateToken(user);
    const arePasswordsEqual = await bcrypt.compare(dto.password, user.password);
    if (arePasswordsEqual) {
      console.log(`user before setting to namespace: ${JSON.stringify(user)}`);
      context.set(CONTEXT_KEYS.USER, user);
      return this.generateToken(user);
    } else throw new HttpException('Wrong password!', HttpStatus.BAD_REQUEST);
  }

  async register(dto: CreateUserDto) {
    if (await this.userService.getUsersByEmail(dto.email)) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(dto.password, 5);

    const user = await this.userService.createUser({
      ...dto,
      password: hashPassword,
    });

    return this.generateToken(user);
  }

  generateToken(user: User) {
    const payload = { email: user.email, id: user.id, roles: user.roles };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    console.log(`in validate google user, user: ${JSON.stringify(googleUser)}`);
    const user = await this.userService.getUsersByEmail(googleUser.email);
    if (user) return user;

    return await this.userService.createUser(googleUser);
  }
}
