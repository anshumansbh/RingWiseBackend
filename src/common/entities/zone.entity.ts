import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Speaker } from './speaker.entity';
import { Schedule } from './schedule.entity';

@Entity('zones')
export class Zone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Speaker, (speaker) => speaker.zone)
  speakers: Speaker[];

  @OneToMany(() => Schedule, (schedule) => schedule.zone)
  schedules: Schedule[];
}

