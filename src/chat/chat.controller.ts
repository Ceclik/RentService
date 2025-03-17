import { Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesAuthGuard } from '../auth/guards/roles-auth.guard';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Chat } from './chat.model';
import { Message } from './messages.model';

@ApiTags('Operations with chat')
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @ApiOperation({
    summary: 'Returns all chats of user',
  })
  @ApiResponse({ status: 200, type: [Chat] })
  @UseGuards(JwtAuthGuard)
  @Get('/all/:userId')
  getAllChatsOfUser(@Param('userId') userId: number) {
    return this.chatService.getAllOfUser(userId);
  }

  @ApiOperation({
    summary: 'Returns messages of chat',
  })
  @ApiResponse({ status: 200, type: [Message] })
  @UseGuards(JwtAuthGuard)
  @Get('/messages/all/:chatId')
  getAllMessagesOfChat(@Param('chatId') chatId: number) {
    return this.chatService.getAllMessagesOfChat(chatId);
  }

  @ApiOperation({
    summary: 'Removes message from chat',
  })
  @ApiResponse({ status: 200, type: String })
  @UseGuards(JwtAuthGuard)
  @Delete('/deleteMessage/:id')
  deleteMessage(@Param('id') id: number) {
    return this.chatService.deleteMessage(id);
  }

  @ApiOperation({
    summary: 'Removes chat',
  })
  @ApiResponse({ status: 200, type: String })
  @UseGuards(JwtAuthGuard)
  @Delete('/deleteMessage/:id')
  deleteChat(@Param('id') id: number) {
    return this.chatService.deleteChat(id);
  }
}
