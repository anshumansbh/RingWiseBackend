import { Module, Global } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MqttBroker } from './mqtt.broker';
import { MqttConfig } from '../config/mqtt.config';

@Global()
@Module({
  providers: [MqttService, MqttBroker, MqttConfig],
  exports: [MqttService],
})
export class MqttModule {}

