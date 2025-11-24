import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule, ScheduleType } from '../common/entities/schedule.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      relations: ['audioFile', 'zone'],
    });
  }

  async findOne(id: string): Promise<Schedule> {
    return this.scheduleRepository.findOne({
      where: { id },
      relations: ['audioFile', 'zone'],
    });
  }

  async create(scheduleData: Partial<Schedule>): Promise<Schedule> {
    const schedule = this.scheduleRepository.create(scheduleData);
    return this.scheduleRepository.save(schedule);
  }

  async update(id: string, scheduleData: Partial<Schedule>): Promise<Schedule> {
    await this.scheduleRepository.update(id, scheduleData);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.scheduleRepository.delete(id);
  }

  async findEnabled(): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { enabled: true },
      relations: ['audioFile', 'zone'],
    });
  }
}

