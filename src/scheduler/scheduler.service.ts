import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Schedule, ScheduleType } from '../common/entities/schedule.entity';
import { Holiday } from '../common/entities/holiday.entity';
import { ScheduleOverride, OverrideAction } from '../common/entities/schedule-override.entity';
import { MqttService } from '../mqtt/mqtt.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  private cronJobs: Map<string, any> = new Map();

  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Holiday)
    private holidayRepository: Repository<Holiday>,
    @InjectRepository(ScheduleOverride)
    private overrideRepository: Repository<ScheduleOverride>,
    private mqttService: MqttService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkSchedules() {
    const now = new Date();
    const enabledSchedules = await this.scheduleRepository.find({
      where: { enabled: true },
      relations: ['audioFile', 'zone'],
    });

    for (const schedule of enabledSchedules) {
      if (await this.shouldTrigger(schedule, now)) {
        await this.triggerBell(schedule);
      }
    }
  }

  private async shouldTrigger(schedule: Schedule, now: Date): Promise<boolean> {
    // Check if it's a holiday
    const isHoliday = await this.checkHolidays(now);
    if (isHoliday) {
      // Check for override
      const override = await this.overrideRepository.findOne({
        where: {
          scheduleId: schedule.id,
          overrideDate: now.toISOString().split('T')[0],
        },
      });

      if (override) {
        if (override.action === OverrideAction.SKIP) {
          return false;
        } else if (override.action === OverrideAction.ENABLE) {
          // Continue to check schedule
        } else if (override.action === OverrideAction.REPLACE) {
          // Use replacement audio
          schedule.audioFile = override.replacementAudio;
        }
      } else {
        // Default: skip on holidays
        return false;
      }
    }

    // Check schedule type
    if (schedule.type === ScheduleType.DAILY) {
      const scheduleTime = schedule.scheduledTime;
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      return scheduleTime === currentTime;
    } else if (schedule.type === ScheduleType.ONE_TIME) {
      const scheduleDate = new Date(schedule.scheduledDate);
      return (
        scheduleDate.getFullYear() === now.getFullYear() &&
        scheduleDate.getMonth() === now.getMonth() &&
        scheduleDate.getDate() === now.getDate() &&
        scheduleDate.getHours() === now.getHours() &&
        scheduleDate.getMinutes() === now.getMinutes()
      );
    } else if (schedule.type === ScheduleType.WEEKLY) {
      // Weekly schedule logic
      const scheduleTime = schedule.scheduledTime;
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      // TODO: Check day of week from cron expression
      return scheduleTime === currentTime;
    }

    return false;
  }

  private async checkHolidays(date: Date): Promise<boolean> {
    const dateStr = date.toISOString().split('T')[0];
    const holiday = await this.holidayRepository.findOne({
      where: { date: dateStr as any, isActive: true },
    });
    return !!holiday;
  }

  private async triggerBell(schedule: Schedule): Promise<void> {
    this.logger.log(`Triggering bell for schedule: ${schedule.name}`);

    const topic = schedule.zoneId
      ? `ringwise/zone/${schedule.zoneId}/bell`
      : 'ringwise/bell/schedule';

    const payload = {
      type: 'bell',
      schedule_id: schedule.id,
      audio_id: schedule.audioFileId,
      zone_id: schedule.zoneId,
      timestamp: new Date().toISOString(),
      priority: 'normal',
    };

    this.mqttService.publish(topic, payload);
  }

  async triggerSOS(message: string): Promise<void> {
    this.logger.log('Triggering SOS broadcast');
    const payload = {
      type: 'sos',
      message,
      timestamp: new Date().toISOString(),
      priority: 'critical',
    };
    this.mqttService.publish('ringwise/bell/sos', payload);
  }
}

