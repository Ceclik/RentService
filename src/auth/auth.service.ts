import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.model';

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

    const arePasswordsEqual = await bcrypt.compare(dto.password, user.password);
    if (arePasswordsEqual) return this.generateToken(user);
    else throw new HttpException('Wrong password!', HttpStatus.BAD_REQUEST);
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
}
