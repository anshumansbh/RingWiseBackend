import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Speaker } from './speaker.entity';
import { Schedule } from './schedule.entity';
import { AudioFile } from './audio-file.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'event_type' })
  eventType: string;

  @Column({ name: 'speaker_id', nullable: true })
  speakerId: string;

  @ManyToOne(() => Speaker, (speaker) => speaker.events, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'speaker_id' })
  speaker: Speaker;

  @Column({ name: 'schedule_id', nullable: true })
  scheduleId: string;

  @ManyToOne(() => Schedule, (schedule) => schedule.events, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;

  @Column({ name: 'audio_file_id', nullable: true })
  audioFileId: string;

  @ManyToOne(() => AudioFile, (audioFile) => audioFile.events, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'audio_file_id' })
  audioFile: AudioFile;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;

  @Column({ nullable: true })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  details: Record<string, any>;
}

