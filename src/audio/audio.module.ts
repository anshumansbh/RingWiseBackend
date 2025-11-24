import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';
import { AudioFile } from '../common/entities/audio-file.entity';
import { MqttModule } from '../mqtt/mqtt.module';

@Module({
  imports: [TypeOrmModule.forFeature([AudioFile]), MqttModule],
  controllers: [AudioController],
  providers: [AudioService],
  exports: [AudioService],
})
export class AudioModule {}

