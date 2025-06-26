import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { AddUserRoleDto } from './dto/add-user-role.dto';
import { UsersRepository } from '@modules/users/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(dto: CreateUserDto) {
    const transaction = await this.usersRepository.createTransaction();
    try {
      let createdUser;
      if (transaction)
        createdUser = await this.usersRepository.createUser(dto, transaction);
      if (transaction) await transaction.commit();
      return createdUser;
    } catch (err) {
      if (transaction) await transaction.rollback();
      throw err;
    }
  }

  async getUsersByEmail(email: string) {
    return await this.usersRepository.getByEmail(email);
  }

  async getAllUsers() {
    const users = await this.usersRepository.getAll();
    if (!users)
      throw new HttpException('internal', HttpStatus.INTERNAL_SERVER_ERROR);
    return users;
  }

  async deleteUser(id: number) {
    await this.usersRepository.deleteUser(id);
    return JSON.stringify('User has been successfully deleted!');
  }

  async banUser(dto: BanUserDto) {
    await this.usersRepository.banUser(dto);

    return JSON.stringify('Selected user has been successfully banned!');
  }

  async addRoleToUser(dto: AddUserRoleDto) {
    return await this.usersRepository.addRole(dto);
  }
}
