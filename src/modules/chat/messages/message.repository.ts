import { Injectable } from '@nestjs/common';
import { Message } from '@modules/chat/messages/messages.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMessageDto } from '@modules/chat/dto/create-message.dto';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(Message) private messageRepository: typeof Message,
  ) {}

  async createMessage(dto: CreateMessageDto, chatid: number): Promise<Message> {
    return await this.messageRepository.create({
      ...dto,
      chatid,
    });
  }

  async getAllUnreadOfUser(userId: number) {
    return await this.messageRepository.findAll({
      where: { receiverId: userId, hasdelivered: false },
      order: [['createdAt', 'DESC']],
    });
  }

  async setReadFlagTrue(messageId: number) {
    await this.messageRepository.update(
      { hasdelivered: true },
      { where: { id: messageId } },
    );
  }

  async deleteMessage(id: number) {
    await this.messageRepository.destroy({ where: { id } });
  }

  async findAllMessagesInChat(chatid: number) {
    return await this.messageRepository.findAll({ where: { chatid } });
  }
}
