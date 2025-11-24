import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AudioFile } from '../common/entities/audio-file.entity';
import { MqttService } from '../mqtt/mqtt.service';

@Injectable()
export class AudioService {
  constructor(
    @InjectRepository(AudioFile)
    private audioFileRepository: Repository<AudioFile>,
    private mqttService: MqttService,
  ) {}

  async findAll(): Promise<AudioFile[]> {
    return this.audioFileRepository.find({
      relations: ['uploadedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<AudioFile> {
    return this.audioFileRepository.findOne({
      where: { id },
      relations: ['uploadedBy'],
    });
  }

  async create(
    filename: string,
    filePath: string,
    fileSize: number,
    duration: number,
    uploadedById: string,
  ): Promise<AudioFile> {
    const audioFile = this.audioFileRepository.create({
      filename,
      filePath,
      fileSize,
      duration,
      uploadedById,
    });

    const saved = await this.audioFileRepository.save(audioFile);

    // Notify via MQTT
    this.mqttService.publish(`ringwise/audio/upload/${saved.id}`, {
      audio_id: saved.id,
      filename: saved.filename,
      file_size: saved.fileSize,
    });

    return saved;
  }

  async delete(id: string): Promise<void> {
    await this.audioFileRepository.delete(id);
    
    // Notify via MQTT
    this.mqttService.publish(`ringwise/audio/delete/${id}`, {
      audio_id: id,
    });
  }
}

