import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Holiday } from '../common/entities/holiday.entity';

@Injectable()
export class HolidaysService {
  constructor(
    @InjectRepository(Holiday)
    private holidayRepository: Repository<Holiday>,
  ) {}

  async findAll(): Promise<Holiday[]> {
    return this.holidayRepository.find({
      order: { date: 'ASC' },
    });
  }

  async create(holidayData: Partial<Holiday>): Promise<Holiday> {
    const holiday = this.holidayRepository.create(holidayData);
    return this.holidayRepository.save(holiday);
  }

  async delete(id: string): Promise<void> {
    await this.holidayRepository.delete(id);
  }
}

