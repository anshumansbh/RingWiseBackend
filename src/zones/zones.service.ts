import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from '../common/entities/zone.entity';

@Injectable()
export class ZonesService {
  constructor(
    @InjectRepository(Zone)
    private zoneRepository: Repository<Zone>,
  ) {}

  async findAll(): Promise<Zone[]> {
    return this.zoneRepository.find({
      relations: ['speakers'],
    });
  }

  async findOne(id: string): Promise<Zone> {
    return this.zoneRepository.findOne({
      where: { id },
      relations: ['speakers'],
    });
  }

  async create(zoneData: Partial<Zone>): Promise<Zone> {
    const zone = this.zoneRepository.create(zoneData);
    return this.zoneRepository.save(zone);
  }

  async update(id: string, zoneData: Partial<Zone>): Promise<Zone> {
    await this.zoneRepository.update(id, zoneData);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.zoneRepository.delete(id);
  }
}

