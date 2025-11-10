import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { QueueModule } from '../../queue/queue.module';
@Module({ imports: [QueueModule], providers: [ExportService], controllers: [ExportController], exports: [ExportService] })
export class ExportModule {}