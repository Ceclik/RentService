import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Type } from './types.model';
import { CreateTypeDto } from './dto/create-type.dto';

@Injectable()
export class TypesService {
  constructor(@InjectModel(Type) private typeRepository: typeof Type) {}

  async createType(dto: CreateTypeDto) {
    return await this.typeRepository.create(dto);
  }

  async getAllTypes() {
    return await this.typeRepository.findAll();
  }

  async deleteType(id: number) {
    await this.typeRepository.destroy({ where: { id } });
    return JSON.stringify('Type has been successfully deleted');
  }
}
