import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Zone } from './zone.entity';
import { User } from './user.entity';
import { Event } from './event.entity';

export enum SpeakerStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

@Entity('speakers')
export class Speaker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'device_id', unique: true })
  deviceId: string;

  @Column()
  name: string;

  @Column({ name: 'zone_id', nullable: true })
  zoneId: string;

  @ManyToOne(() => Zone, (zone) => zone.speakers, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'zone_id' })
  zone: Zone;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.speakers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'last_seen', type: 'timestamp', nullable: true })
  lastSeen: Date;

  @Column({
    type: 'enum',
    enum: SpeakerStatus,
    default: SpeakerStatus.OFFLINE,
  })
  status: SpeakerStatus;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Event, (event) => event.speaker)
  events: Event[];
}

