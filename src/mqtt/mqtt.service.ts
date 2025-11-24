import { Injectable, Logger } from '@nestjs/common';
import { MqttBroker } from './mqtt.broker';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService {
  private readonly logger = new Logger(MqttService.name);
  private client: mqtt.MqttClient;

  constructor(private mqttBroker: MqttBroker) {
    // Connect as internal client to the broker
    this.client = mqtt.connect('mqtt://localhost:1883');
    
    this.client.on('connect', () => {
      this.logger.log('MQTT client connected');
    });

    this.client.on('error', (error) => {
      this.logger.error('MQTT client error:', error);
    });
  }

  publish(topic: string, payload: any, options?: mqtt.IClientPublishOptions): void {
    const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
    this.client.publish(topic, message, {
      qos: 1,
      retain: false,
      ...options,
    });
    this.logger.debug(`Published to ${topic}: ${message}`);
  }

  subscribe(topic: string | string[], callback: (topic: string, message: Buffer) => void): void {
    this.client.subscribe(topic, (err) => {
      if (err) {
        this.logger.error(`Error subscribing to ${topic}:`, err);
      } else {
        this.logger.log(`Subscribed to ${topic}`);
      }
    });

    this.client.on('message', (receivedTopic, message) => {
      if (Array.isArray(topic)) {
        if (topic.includes(receivedTopic)) {
          callback(receivedTopic, message);
        }
      } else if (receivedTopic === topic || receivedTopic.startsWith(topic + '/')) {
        callback(receivedTopic, message);
      }
    });
  }

  getClient(): mqtt.MqttClient {
    return this.client;
  }
}

