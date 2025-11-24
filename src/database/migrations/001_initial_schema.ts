import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Users table
    await queryRunner.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'speaker')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`CREATE INDEX idx_users_email ON users(email)`);
    await queryRunner.query(`CREATE INDEX idx_users_role ON users(role)`);

    // Zones table
    await queryRunner.query(`
      CREATE TABLE zones (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`CREATE INDEX idx_zones_name ON zones(name)`);

    // Speakers table
    await queryRunner.query(`
      CREATE TABLE speakers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        device_id VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        last_seen TIMESTAMP,
        status VARCHAR(20) NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline')),
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`CREATE INDEX idx_speakers_device_id ON speakers(device_id)`);
    await queryRunner.query(`CREATE INDEX idx_speakers_zone_id ON speakers(zone_id)`);
    await queryRunner.query(`CREATE INDEX idx_speakers_user_id ON speakers(user_id)`);
    await queryRunner.query(`CREATE INDEX idx_speakers_status ON speakers(status)`);

    // Audio files table
    await queryRunner.query(`
      CREATE TABLE audio_files (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        filename VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size BIGINT NOT NULL,
        duration INTEGER,
        uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`CREATE INDEX idx_audio_files_uploaded_by ON audio_files(uploaded_by)`);
    await queryRunner.query(`CREATE INDEX idx_audio_files_created_at ON audio_files(created_at)`);

    // Schedules table
    await queryRunner.query(`
      CREATE TABLE schedules (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('daily', 'one_time', 'weekly')),
        cron_expression VARCHAR(100),
        scheduled_time TIME,
        scheduled_date DATE,
        audio_file_id UUID REFERENCES audio_files(id) ON DELETE CASCADE,
        zone_id UUID REFERENCES zones(id) ON DELETE CASCADE,
        enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`CREATE INDEX idx_schedules_type ON schedules(type)`);
    await queryRunner.query(`CREATE INDEX idx_schedules_zone_id ON schedules(zone_id)`);
    await queryRunner.query(`CREATE INDEX idx_schedules_audio_file_id ON schedules(audio_file_id)`);
    await queryRunner.query(`CREATE INDEX idx_schedules_enabled ON schedules(enabled)`);
    await queryRunner.query(`CREATE INDEX idx_schedules_scheduled_date ON schedules(scheduled_date)`);

    // Holidays table
    await queryRunner.query(`
      CREATE TABLE holidays (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        date DATE NOT NULL,
        name VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`CREATE UNIQUE INDEX idx_holidays_date ON holidays(date)`);
    await queryRunner.query(`CREATE INDEX idx_holidays_is_active ON holidays(is_active)`);

    // Schedule overrides table
    await queryRunner.query(`
      CREATE TABLE schedule_overrides (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
        override_date DATE NOT NULL,
        action VARCHAR(20) NOT NULL CHECK (action IN ('skip', 'enable', 'replace')),
        replacement_audio_id UUID REFERENCES audio_files(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`CREATE INDEX idx_schedule_overrides_schedule_id ON schedule_overrides(schedule_id)`);
    await queryRunner.query(`CREATE INDEX idx_schedule_overrides_override_date ON schedule_overrides(override_date)`);
    await queryRunner.query(`CREATE UNIQUE INDEX idx_schedule_overrides_schedule_date ON schedule_overrides(schedule_id, override_date)`);

    // TTS announcements table
    await queryRunner.query(`
      CREATE TABLE tts_announcements (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        text TEXT NOT NULL,
        audio_file_id UUID REFERENCES audio_files(id) ON DELETE CASCADE,
        created_by UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`CREATE INDEX idx_tts_announcements_audio_file_id ON tts_announcements(audio_file_id)`);
    await queryRunner.query(`CREATE INDEX idx_tts_announcements_created_by ON tts_announcements(created_by)`);

    // Events table
    await queryRunner.query(`
      CREATE TABLE events (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        event_type VARCHAR(100) NOT NULL,
        speaker_id UUID REFERENCES speakers(id) ON DELETE SET NULL,
        schedule_id UUID REFERENCES schedules(id) ON DELETE SET NULL,
        audio_file_id UUID REFERENCES audio_files(id) ON DELETE SET NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50),
        details JSONB
      )
    `);

    await queryRunner.query(`CREATE INDEX idx_events_event_type ON events(event_type)`);
    await queryRunner.query(`CREATE INDEX idx_events_speaker_id ON events(speaker_id)`);
    await queryRunner.query(`CREATE INDEX idx_events_schedule_id ON events(schedule_id)`);
    await queryRunner.query(`CREATE INDEX idx_events_timestamp ON events(timestamp)`);
    await queryRunner.query(`CREATE INDEX idx_events_details ON events USING GIN(details)`);

    // Function to update updated_at timestamp
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);

    // Triggers for updated_at
    await queryRunner.query(`
      CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_schedules_updated_at ON schedules`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_users_updated_at ON users`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column`);
    await queryRunner.query(`DROP TABLE IF EXISTS events`);
    await queryRunner.query(`DROP TABLE IF EXISTS tts_announcements`);
    await queryRunner.query(`DROP TABLE IF EXISTS schedule_overrides`);
    await queryRunner.query(`DROP TABLE IF EXISTS holidays`);
    await queryRunner.query(`DROP TABLE IF EXISTS schedules`);
    await queryRunner.query(`DROP TABLE IF EXISTS audio_files`);
    await queryRunner.query(`DROP TABLE IF EXISTS speakers`);
    await queryRunner.query(`DROP TABLE IF EXISTS zones`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
  }
}

