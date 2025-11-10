import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { QueueService } from '../../queue/queue.service';
@Injectable()
export class ExportService {
  constructor(private readonly queue: QueueService) {}
  async enqueueExport(orgId: string, surveyId: string, userId?: string, opts: any = {}) {
    const jobId = uuidv4();
    const payload = { jobId, orgId, surveyId, userId, opts, ts: Date.now() };
    await this.queue.sendToQueue('export_jobs', payload);
    return { jobId, status: 'queued' };
  }
}