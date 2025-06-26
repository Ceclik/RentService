import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Type } from '@modules/types/types.model';
import { CreateTypeDto } from '@modules/types/dto/create-type.dto';

@Injectable()
export class TypesRepository {
  constructor(@InjectModel(Type) private typeRepository: typeof Type) {}

  async findById(id: number) {
    return await this.typeRepository.findByPk(id);
  }

  async create(dto: CreateTypeDto) {
    return await this.typeRepository.create(dto);
  }

  async getAll() {
    return await this.typeRepository.findAll();
  }

  async delete(id: number) {
    await this.typeRepository.destroy({ where: { id } });
  }
}
