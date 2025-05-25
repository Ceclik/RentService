import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './messages/messages.model';
import { CreateMessageDto } from './dto/create-message.dto';
import { Chat } from './chat.model';
import { Op } from 'sequelize';
import { ChatRepository } from '@modules/chat/chat.repository';
import { MessageRepository } from '@modules/chat/messages/message.repository';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message) private messageRepository: typeof Message,
    private messageRep: MessageRepository,
    @InjectModel(Chat) private chatRepository: typeof Chat,
    private chatRep: ChatRepository,
  ) {}

  async createMessage(dto: CreateMessageDto) {
    try {
      let chatid: number = 0;
      const chat = await this.chatRep.findChatFromTwoUsers(dto);
      if (!chat) {
        const createdChat = await this.chatRep.createChat(dto);
        chatid = createdChat.id;
      } else {
        if (chat instanceof Chat) chatid = chat.id;
      }
      return await this.messageRep.createMessage(dto, chatid);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async deleteMessage(id: number) {
    try {
      await this.messageRep.deleteMessage(id);
      return JSON.stringify('Message has been successfully deleted!');
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllMessagesOfChat(chatid: number) {
    try {
      return await this.messageRep.findAllMessagesInChat(chatid);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async deleteChat(id: number) {
    try {
      await this.chatRep.destroyChat(id);
      return JSON.stringify('Chat has been successfully deleted!');
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllOfUser(userId: number) {
    try {
      return await this.chatRep.getAllChatsOfUser(userId);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
