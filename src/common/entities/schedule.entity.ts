import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { AudioFile } from './audio-file.entity';
import { Zone } from './zone.entity';
import { ScheduleOverride } from './schedule-override.entity';
import { Event } from './event.entity';

export enum ScheduleType {
  DAILY = 'daily',
  ONE_TIME = 'one_time',
  WEEKLY = 'weekly',
}

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ScheduleType,
  })
  type: ScheduleType;

  @Column({ name: 'cron_expression', nullable: true })
  cronExpression: string;

  @Column({ name: 'scheduled_time', type: 'time', nullable: true })
  scheduledTime: string;

  @Column({ name: 'scheduled_date', type: 'date', nullable: true })
  scheduledDate: Date;

  @Column({ name: 'audio_file_id', nullable: true })
  audioFileId: string;

  @ManyToOne(() => AudioFile, (audioFile) => audioFile.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'audio_file_id' })
  audioFile: AudioFile;

  @Column({ name: 'zone_id', nullable: true })
  zoneId: string;

  @ManyToOne(() => Zone, (zone) => zone.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zone_id' })
  zone: Zone;

  @Column({ default: true })
  enabled: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ScheduleOverride, (override) => override.schedule)
  overrides: ScheduleOverride[];

  @OneToMany(() => Event, (event) => event.schedule)
  events: Event[];
}

