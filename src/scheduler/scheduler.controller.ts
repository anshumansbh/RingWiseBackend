import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/entities/user.entity';

@Controller('api/sos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class SchedulerController {
  constructor(private schedulerService: SchedulerService) {}

  @Post('trigger')
  async triggerSOS(@Body() body: { message?: string }) {
    await this.schedulerService.triggerSOS(body.message || 'Emergency SOS');
    return { message: 'SOS triggered successfully' };
  }
}

