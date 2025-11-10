import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
@Injectable()
export class QueueService implements OnModuleDestroy {
  private conn: amqp.Connection;
  private channel: amqp.Channel;
  private readonly logger = new Logger(QueueService.name);
  async connect(url = process.env.RABBITMQ_URL || 'amqp://localhost') {
    if (this.conn) return;
    this.conn = await amqp.connect(url);
    this.channel = await this.conn.createChannel();
  }
  async assertQueue(name: string) {
    await this.connect();
    await this.channel.assertQueue(name, { durable: true });
  }
  async sendToQueue(name: string, payload: any) {
    await this.assertQueue(name);
    const buf = Buffer.from(JSON.stringify(payload));
    this.channel.sendToQueue(name, buf, { persistent: true });
    this.logger.debug(`published to queue ${name}`);
  }
  async consume(name: string, handler: (msg: amqp.Message) => Promise<void> | void) {
    await this.assertQueue(name);
    await this.channel.consume(name, async (msg) => {
      if (!msg) return;
      try {
        await handler(msg);
        this.channel.ack(msg);
      } catch (err) {
        this.logger.error('handler error', err as any);
        this.channel.nack(msg, false, false);
      }
    });
  }
  async onModuleDestroy() {
    try {
      await this.channel?.close();
      await this.conn?.close();
    } catch (e) {
      // noop
    }
  }
}