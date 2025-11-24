import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { Schedule } from '../common/entities/schedule.entity';
import { AudioFile } from '../common/entities/audio-file.entity';
import { Zone } from '../common/entities/zone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, AudioFile, Zone])],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}

