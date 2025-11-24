import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import * as aedes from 'aedes';
import * as net from 'net';
import { MqttConfig } from '../config/mqtt.config';

@Injectable()
export class MqttBroker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttBroker.name);
  private broker: aedes.Aedes;
  private server: net.Server;

  constructor(private mqttConfig: MqttConfig) {}

  onModuleInit() {
    this.broker = aedes.createBroker({
      authenticate: (client, username, password, callback) => {
        // Simple authentication - can be enhanced with JWT
        const configUsername = this.mqttConfig.getUsername();
        const configPassword = this.mqttConfig.getPassword();
        
        if (configUsername && configPassword) {
          if (username === configUsername && password?.toString() === configPassword) {
            callback(null, true);
          } else {
            callback(new Error('Invalid credentials'), false);
          }
        } else {
          // No authentication configured - allow all
          callback(null, true);
        }
      },
    });

    // Handle client connections
    this.broker.on('client', (client) => {
      this.logger.log(`Client connected: ${client.id}`);
    });

    // Handle client disconnections
    this.broker.on('clientDisconnect', (client) => {
      this.logger.log(`Client disconnected: ${client.id}`);
    });

    // Handle published messages
    this.broker.on('publish', (packet, client) => {
      if (client) {
        this.logger.debug(`Message published by ${client.id} to ${packet.topic}`);
      }
    });

    // Start server
    const port = this.mqttConfig.getPort();
    const host = this.mqttConfig.getHost();
    this.server = net.createServer(this.broker.handle);
    
    this.server.listen(port, host, () => {
      this.logger.log(`MQTT broker listening on ${host}:${port}`);
    });
  }

  onModuleDestroy() {
    if (this.server) {
      this.server.close();
    }
    if (this.broker) {
      this.broker.close();
    }
  }

  getBroker(): aedes.Aedes {
    return this.broker;
  }
}

