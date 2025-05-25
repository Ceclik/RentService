import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from '@modules/chat/chat.model';
import { CreateMessageDto } from '@modules/chat/dto/create-message.dto';
import { Op } from 'sequelize';

@Injectable()
export class ChatRepository {
  constructor(@InjectModel(Chat) private chatRepository: typeof Chat) {}

  async findChatFromTwoUsers(dto: CreateMessageDto) {
    return await this.chatRepository.findOne({
      where: {
        [Op.or]: [
          { user1Id: dto.senderId, user2Id: dto.receiverId },
          { user1Id: dto.receiverId, user2Id: dto.senderId },
        ],
      },
    });
  }

  async createChat(dto: CreateMessageDto) {
    return await this.chatRepository.create({
      user1Id: dto.senderId,
      user2Id: dto.receiverId,
    });
  }

  async destroyChat(id: number) {
    await this.chatRepository.destroy({ where: { id } });
  }

  async getAllChatsOfUser(userId: number) {
    return await this.chatRepository.findAll({
      where: {
        [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
      },
    });
  }
}
