import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TtsController } from './tts.controller';
import { TtsService } from './tts.service';
import { TtsAnnouncement } from '../common/entities/tts-announcement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TtsAnnouncement])],
  controllers: [TtsController],
  providers: [TtsService],
  exports: [TtsService],
})
export class TtsModule {}

