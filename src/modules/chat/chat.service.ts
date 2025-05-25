import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Chat } from './chat.model';
import { ChatRepository } from '@modules/chat/chat.repository';
import { MessageRepository } from '@modules/chat/messages/message.repository';

@Injectable()
export class ChatService {
  constructor(
    private messageRepository: MessageRepository,
    private chatRepository: ChatRepository,
  ) {}

  async createMessage(dto: CreateMessageDto) {
    try {
      let chatid: number = 0;
      const chat = await this.chatRepository.findChatFromTwoUsers(dto);
      if (!chat) {
        const createdChat = await this.chatRepository.createChat(dto);
        chatid = createdChat.id;
      } else {
        if (chat instanceof Chat) chatid = chat.id;
      }
      return await this.messageRepository.createMessage(dto, chatid);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async deleteMessage(id: number) {
    try {
      await this.messageRepository.deleteMessage(id);
      return JSON.stringify('Message has been successfully deleted!');
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllMessagesOfChat(chatid: number) {
    try {
      return await this.messageRepository.findAllMessagesInChat(chatid);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async deleteChat(id: number) {
    try {
      await this.chatRepository.destroyChat(id);
      return JSON.stringify('Chat has been successfully deleted!');
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllOfUser(userId: number) {
    try {
      return await this.chatRepository.getAllChatsOfUser(userId);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
