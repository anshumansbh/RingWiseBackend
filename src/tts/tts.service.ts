import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TtsAnnouncement } from '../common/entities/tts-announcement.entity';

@Injectable()
export class TtsService {
  constructor(
    @InjectRepository(TtsAnnouncement)
    private ttsRepository: Repository<TtsAnnouncement>,
  ) {}

  async create(text: string, audioFileId: string, createdById: string): Promise<TtsAnnouncement> {
    const tts = this.ttsRepository.create({
      text,
      audioFileId,
      createdById,
    });
    return this.ttsRepository.save(tts);
  }

  async findOne(id: string): Promise<TtsAnnouncement> {
    return this.ttsRepository.findOne({
      where: { id },
      relations: ['audioFile', 'createdBy'],
    });
  }
}

