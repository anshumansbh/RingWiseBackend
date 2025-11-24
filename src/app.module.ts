import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { SchedulesModule } from './schedules/schedules.module';
import { AudioModule } from './audio/audio.module';
import { ZonesModule } from './zones/zones.module';
import { DevicesModule } from './devices/devices.module';
import { MqttModule } from './mqtt/mqtt.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { TtsModule } from './tts/tts.module';
import { HolidaysModule } from './holidays/holidays.module';
import { EventsModule } from './events/events.module';
import { DatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    SchedulesModule,
    AudioModule,
    ZonesModule,
    DevicesModule,
    MqttModule,
    SchedulerModule,
    TtsModule,
    HolidaysModule,
    EventsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

