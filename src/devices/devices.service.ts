import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Speaker, SpeakerStatus } from '../common/entities/speaker.entity';
import { MqttService } from '../mqtt/mqtt.service';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Speaker)
    private speakerRepository: Repository<Speaker>,
    private mqttService: MqttService,
  ) {}

  async findAll(): Promise<Speaker[]> {
    return this.speakerRepository.find({
      relations: ['zone', 'user'],
    });
  }

  async findOne(id: string): Promise<Speaker> {
    return this.speakerRepository.findOne({
      where: { id },
      relations: ['zone', 'user'],
    });
  }

  async findByDeviceId(deviceId: string): Promise<Speaker> {
    return this.speakerRepository.findOne({
      where: { deviceId },
      relations: ['zone', 'user'],
    });
  }

  async updateStatus(deviceId: string, status: SpeakerStatus, ipAddress?: string): Promise<Speaker> {
    const speaker = await this.findByDeviceId(deviceId);
    if (!speaker) {
      throw new Error('Speaker not found');
    }

    speaker.status = status;
    speaker.lastSeen = new Date();
    if (ipAddress) {
      speaker.ipAddress = ipAddress;
    }

    return this.speakerRepository.save(speaker);
  }

  async sendCommand(deviceId: string, command: string, payload?: any): Promise<void> {
    this.mqttService.publish(`ringwise/device/${deviceId}/command`, {
      command,
      payload,
      timestamp: new Date().toISOString(),
    });
  }
}

