import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Speaker } from './speaker.entity';
import { AudioFile } from './audio-file.entity';
import { TtsAnnouncement } from './tts-announcement.entity';

export enum UserRole {
  ADMIN = 'admin',
  SPEAKER = 'speaker',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Speaker, (speaker) => speaker.user)
  speakers: Speaker[];

  @OneToMany(() => AudioFile, (audioFile) => audioFile.uploadedBy)
  audioFiles: AudioFile[];

  @OneToMany(() => TtsAnnouncement, (tts) => tts.createdBy)
  ttsAnnouncements: TtsAnnouncement[];
}

