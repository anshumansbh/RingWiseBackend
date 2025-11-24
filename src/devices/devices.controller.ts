import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/entities/user.entity';

@Controller('api/devices')
@UseGuards(JwtAuthGuard)
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.devicesService.findAll();
  }

  @Get(':id/status')
  async getStatus(@Param('id') id: string) {
    return this.devicesService.findOne(id);
  }

  @Post(':id/command')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async sendCommand(
    @Param('id') id: string,
    @Body() body: { command: string; payload?: any },
  ) {
    const speaker = await this.devicesService.findOne(id);
    await this.devicesService.sendCommand(speaker.deviceId, body.command, body.payload);
    return { message: 'Command sent successfully' };
  }
}

