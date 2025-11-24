import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../common/entities/user.entity';
import { Zone } from '../common/entities/zone.entity';
import { Speaker } from '../common/entities/speaker.entity';
import { AudioFile } from '../common/entities/audio-file.entity';
import { Schedule } from '../common/entities/schedule.entity';
import { Holiday } from '../common/entities/holiday.entity';
import { ScheduleOverride } from '../common/entities/schedule-override.entity';
import { TtsAnnouncement } from '../common/entities/tts-announcement.entity';
import { Event } from '../common/entities/event.entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: this.configService.get<string>('DATABASE_URL'),
      entities: [
        User,
        Zone,
        Speaker,
        AudioFile,
        Schedule,
        Holiday,
        ScheduleOverride,
        TtsAnnouncement,
        Event,
      ],
      synchronize: this.configService.get<string>('NODE_ENV') === 'development',
      logging: this.configService.get<string>('NODE_ENV') === 'development',
      migrations: ['dist/database/migrations/*.js'],
      migrationsRun: true,
    };
  }
}

