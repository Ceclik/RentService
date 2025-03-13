import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesAuthGuard } from '../auth/guards/roles-auth.guard';
import { ContractsService } from './contracts.service';
import { Contract } from './contracts.model';

@ApiTags('Operations with contracts')
@Controller('contracts')
export class ContractsController {
  constructor(private contractsService: ContractsService) {}

  @ApiOperation({
    summary: 'Returns contract and changes it status on "confirmed!"',
  })
  @ApiResponse({ status: 200, type: Contract })
  @Roles('ADMIN', 'OWNER')
  @UseGuards(RolesAuthGuard)
  @Put('/confirm/:id')
  confirm(@Param('id') id: number) {
    return this.contractsService.confirmContract(id);
  }

  @ApiOperation({
    summary: 'Returns contracts of required client',
  })
  @ApiResponse({ status: 200, type: [Contract] })
  @Roles('ADMIN', 'OWNER', 'CLIENT')
  @UseGuards(RolesAuthGuard)
  @Get('/allOfClient/:id')
  getAllOfClient(@Param('id') id: number) {
    return this.contractsService.getAllOfClient(id);
  }

  @ApiOperation({
    summary: 'Returns contracts of required owner',
  })
  @ApiResponse({ status: 200, type: [Contract] })
  @Roles('ADMIN', 'OWNER', 'CLIENT')
  @UseGuards(RolesAuthGuard)
  @Get('/allOfOwner/:id')
  getAllOfOwner(@Param('id') id: number) {
    return this.contractsService.getAllOfOwner(id);
  }

  @ApiOperation({
    summary: 'Returns contracts of required property',
  })
  @ApiResponse({ status: 200, type: [Contract] })
  @Roles('ADMIN', 'OWNER', 'CLIENT')
  @UseGuards(RolesAuthGuard)
  @Get('/allOfProperty/:id')
  getAllOfProperty(@Param('id') id: number) {
    return this.contractsService.getAllOfProperty(id);
  }
}
