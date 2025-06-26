import { Injectable } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { TypesRepository } from '@modules/types/types.repository';

@Injectable()
export class TypesService {
  constructor(private typesRepository: TypesRepository) {}

  async createType(dto: CreateTypeDto) {
    return await this.typesRepository.create(dto);
  }

  async getAllTypes() {
    return await this.typesRepository.getAll();
  }

  async deleteType(id: number) {
    await this.typesRepository.delete(id);
    return JSON.stringify('Type has been successfully deleted');
  }
}
