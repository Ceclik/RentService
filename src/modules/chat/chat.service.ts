import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './messages.model';
import { CreateMessageDto } from './dto/create-message.dto';
import { Chat } from './chat.model';
import { Op } from 'sequelize';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message) private messageRepository: typeof Message,
    @InjectModel(Chat) private chatRepository: typeof Chat,
  ) {}

  async createMessage(dto: CreateMessageDto) {
    try {
      let chatid: number = 0;
      const chat = await this.chatRepository.findOne({
        where: {
          [Op.or]: [
            { user1Id: dto.senderId, user2Id: dto.receiverId },
            { user1Id: dto.receiverId, user2Id: dto.senderId },
          ],
        },
      });
      if (!chat) {
        const createdChat = await this.chatRepository.create({
          user1Id: dto.senderId,
          user2Id: dto.receiverId,
        });
        chatid = createdChat.id;
      } else {
        if (chat instanceof Chat) chatid = chat.id;
      }
      return await this.messageRepository.create({
        ...dto,
        chatid,
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async deleteMessage(id: number) {
    try {
      await this.messageRepository.destroy({ where: { id } });
      return JSON.stringify('Message has been successfully deleted!');
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllMessagesOfChat(chatid: number) {
    try {
      return await this.messageRepository.findAll({ where: { chatid } });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async deleteChat(id: number) {
    try {
      await this.chatRepository.destroy({ where: { id } });
      return JSON.stringify('Chat has been successfully deleted!');
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllOfUser(userId: number) {
    try {
      return await this.chatRepository.findAll({
        where: {
          [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
        },
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
