import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MqttConfig {
  constructor(private configService: ConfigService) {}

  getPort(): number {
    return parseInt(this.configService.get<string>('MQTT_PORT') || '1883', 10);
  }

  getHost(): string {
    return this.configService.get<string>('MQTT_HOST') || '0.0.0.0';
  }

  getTlsPort(): number {
    return parseInt(this.configService.get<string>('MQTT_TLS_PORT') || '8883', 10);
  }

  getUsername(): string | undefined {
    return this.configService.get<string>('MQTT_USERNAME');
  }

  getPassword(): string | undefined {
    return this.configService.get<string>('MQTT_PASSWORD');
  }
}

