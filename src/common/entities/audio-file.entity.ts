import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Schedule } from './schedule.entity';
import { ScheduleOverride } from './schedule-override.entity';
import { TtsAnnouncement } from './tts-announcement.entity';
import { Event } from './event.entity';

@Entity('audio_files')
export class AudioFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column({ name: 'file_path' })
  filePath: string;

  @Column({ name: 'file_size', type: 'bigint' })
  fileSize: number;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column({ name: 'uploaded_by', nullable: true })
  uploadedById: string;

  @ManyToOne(() => User, (user) => user.audioFiles, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'uploaded_by' })
  uploadedBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Schedule, (schedule) => schedule.audioFile)
  schedules: Schedule[];

  @OneToMany(() => ScheduleOverride, (override) => override.replacementAudio)
  scheduleOverrides: ScheduleOverride[];

  @OneToMany(() => TtsAnnouncement, (tts) => tts.audioFile)
  ttsAnnouncements: TtsAnnouncement[];

  @OneToMany(() => Event, (event) => event.audioFile)
  events: Event[];
}

