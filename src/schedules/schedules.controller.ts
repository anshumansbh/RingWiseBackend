import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/entities/user.entity';

@Controller('api/schedules')
@UseGuards(JwtAuthGuard)
export class SchedulesController {
  constructor(private schedulesService: SchedulesService) {}

  @Get()
  async findAll() {
    return this.schedulesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() scheduleData: any) {
    return this.schedulesService.create(scheduleData);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() scheduleData: any) {
    return this.schedulesService.update(id, scheduleData);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string) {
    await this.schedulesService.delete(id);
    return { message: 'Schedule deleted successfully' };
  }

  @Post(':id/trigger')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async trigger(@Param('id') id: string) {
    // Manual trigger logic will be handled by scheduler service
    return { message: 'Schedule triggered' };
  }
}

