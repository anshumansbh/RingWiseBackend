import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../common/entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async create(eventData: Partial<Event>): Promise<Event> {
    const event = this.eventRepository.create(eventData);
    return this.eventRepository.save(event);
  }

  async findAll(limit: number = 100): Promise<Event[]> {
    return this.eventRepository.find({
      relations: ['speaker', 'schedule', 'audioFile'],
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }

  async findBySpeaker(speakerId: string): Promise<Event[]> {
    return this.eventRepository.find({
      where: { speakerId },
      relations: ['schedule', 'audioFile'],
      order: { timestamp: 'DESC' },
    });
  }
}

