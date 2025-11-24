import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AudioFile } from './audio-file.entity';
import { User } from './user.entity';

@Entity('tts_announcements')
export class TtsAnnouncement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ name: 'audio_file_id' })
  audioFileId: string;

  @ManyToOne(() => AudioFile, (audioFile) => audioFile.ttsAnnouncements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'audio_file_id' })
  audioFile: AudioFile;

  @Column({ name: 'created_by', nullable: true })
  createdById: string;

  @ManyToOne(() => User, (user) => user.ttsAnnouncements, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

