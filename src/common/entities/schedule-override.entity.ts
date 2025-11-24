import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { Schedule } from './schedule.entity';
import { AudioFile } from './audio-file.entity';

export enum OverrideAction {
  SKIP = 'skip',
  ENABLE = 'enable',
  REPLACE = 'replace',
}

@Entity('schedule_overrides')
@Unique(['scheduleId', 'overrideDate'])
export class ScheduleOverride {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'schedule_id' })
  scheduleId: string;

  @ManyToOne(() => Schedule, (schedule) => schedule.overrides, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;

  @Column({ name: 'override_date', type: 'date' })
  overrideDate: Date;

  @Column({
    type: 'enum',
    enum: OverrideAction,
  })
  action: OverrideAction;

  @Column({ name: 'replacement_audio_id', nullable: true })
  replacementAudioId: string;

  @ManyToOne(() => AudioFile, (audioFile) => audioFile.scheduleOverrides, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'replacement_audio_id' })
  replacementAudio: AudioFile;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

