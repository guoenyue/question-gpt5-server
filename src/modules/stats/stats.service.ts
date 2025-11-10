import { Injectable, Logger } from '@nestjs/common';
import { QueueService } from '../../queue/queue.service';
@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);
  constructor(private readonly queue: QueueService) {}
  async enqueueRecalc(orgId: string, surveyId: string) {
    const payload = { type: 'recalc', orgId, surveyId, ts: Date.now() }; 
    await this.queue.sendToQueue('stats_jobs', payload);
    this.logger.debug('enqueued stats job');
    return { ok: true };
  }
}