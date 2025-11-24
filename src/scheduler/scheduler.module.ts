import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { Schedule } from '../common/entities/schedule.entity';
import { Holiday } from '../common/entities/holiday.entity';
import { ScheduleOverride } from '../common/entities/schedule-override.entity';
import { MqttModule } from '../mqtt/mqtt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule, Holiday, ScheduleOverride]),
    MqttModule,
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}

