import * as amqp from 'amqplib';
import Redis from 'ioredis';
const RABBIT = process.env.RABBITMQ_URL || 'amqp://localhost';
const REDIS = process.env.REDIS_URL || 'redis://localhost:6379';
async function run() {
  const conn = await amqp.connect(RABBIT);
  const ch = await conn.createChannel();
  await ch.assertQueue('export_jobs', { durable: true });
  const redis = new Redis(REDIS);
  console.log('Export worker listening...');
  ch.consume('export_jobs', async (msg) => {
    if (!msg) return;
    try {
      const payload = JSON.parse(msg.content.toString());
      console.log('Processing export job', payload.jobId);
      const csv = `surveyId,answerCount\n${payload.surveyId},42\n`;
      const key = `exports:${payload.jobId}`;
      await redis.set(key, JSON.stringify({ url: `redis://${REDIS}/${key}`, content: csv }));
      console.log('Export finished for', payload.jobId);
      ch.ack(msg);
    } catch (err) {
      console.error('Worker error', err);
      ch.nack(msg, false, false);
    }
  });
}
run().catch((err) => console.error(err));