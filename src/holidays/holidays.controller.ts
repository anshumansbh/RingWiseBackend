import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/entities/user.entity';

@Controller('api/holidays')
@UseGuards(JwtAuthGuard)
export class HolidaysController {
  constructor(private holidaysService: HolidaysService) {}

  @Get()
  async findAll() {
    return this.holidaysService.findAll();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() holidayData: any) {
    return this.holidaysService.create(holidayData);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string) {
    await this.holidaysService.delete(id);
    return { message: 'Holiday deleted successfully' };
  }
}

