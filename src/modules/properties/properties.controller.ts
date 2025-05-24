import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { Property } from './properties.model';
import { Roles } from '@common/decorators/roles-auth.decorator';
import { RolesAuthGuard } from '@common/guards/roles-auth.guard';
import { ReceivePropertyDto } from './dto/receive-property.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { context, CONTEXT_KEYS } from '@common/cls/request-context';
import { User } from '@modules/users/users.model';

@ApiTags('Operations with properties')
@Controller('api/properties')
export class PropertiesController {
  constructor(private propertiesService: PropertiesService) {}

  @ApiOperation({ summary: 'Creates properties' })
  @ApiResponse({ status: 200, type: Property })
  @Roles('ADMIN', 'OWNER')
  @UseGuards(RolesAuthGuard)
  @Post('/add')
  @UseInterceptors(FilesInterceptor('images'))
  create(@Body() dto: ReceivePropertyDto, @UploadedFiles() images) {
    const user: User = context.get(CONTEXT_KEYS.USER);
    const ownerId: number = user.id;
    return this.propertiesService.createProperty(dto, ownerId, images);
  }

  @ApiOperation({ summary: 'Returns all created properties' })
  @ApiResponse({ status: 200, type: [Property] })
  @Roles('CLIENT', 'OWNER', 'ADMIN')
  @UseGuards(RolesAuthGuard)
  @Get('/all')
  getAllProperties() {
    return this.propertiesService.getAllProperties();
  }

  @ApiOperation({ summary: 'Delete picked property' })
  @ApiResponse({ status: 200, type: String })
  @Roles('OWNER', 'ADMIN')
  @UseGuards(RolesAuthGuard)
  @Delete('/delete/:id')
  deleteProperty(@Param('id') id: number) {
    return this.propertiesService.deleteProperty(id);
  }

  @ApiOperation({ summary: 'Updates properties info' })
  @ApiResponse({ status: 200, type: Property })
  @Roles('ADMIN', 'OWNER')
  @UseGuards(RolesAuthGuard)
  @Put('/update/:id')
  update(@Body() dto: ReceivePropertyDto, @Param('id') id: number) {
    const user: User = context.get(CONTEXT_KEYS.USER);
    const ownerId: number = user.id;
    return this.propertiesService.updateProperty(dto, ownerId, id);
  }

  @ApiOperation({ summary: 'Returns information about one chosen property' })
  @ApiResponse({ status: 200, type: Property })
  @Roles('CLIENT', 'OWNER', 'ADMIN')
  @UseGuards(RolesAuthGuard)
  @Get('/:id')
  getOneProperty(@Param('id') id: number) {
    return this.propertiesService.getOneProperty(id);
  }
}
