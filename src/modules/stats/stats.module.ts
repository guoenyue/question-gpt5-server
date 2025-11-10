import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { QueueModule } from '../../queue/queue.module';
@Module({ imports: [QueueModule], providers: [StatsService], exports: [StatsService] })
export class StatsModule {}