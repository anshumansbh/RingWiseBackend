import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { Event } from '../common/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}

