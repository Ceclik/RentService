import { Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(dto: CreateUserDto) {
    const createdUser = await this.userRepository.create(dto);
    if (!createdUser) throw Error('internal');
    return createdUser;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    if (!users) throw Error('internal');
    return users;
  }
}
