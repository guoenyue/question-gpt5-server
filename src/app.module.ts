import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrgModule } from './modules/orgs/org.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { SurveysModule } from './modules/surveys/surveys.module';
import { ResponsesModule } from './modules/responses/responses.module';
import { RecycleModule } from './modules/recycle/recycle.module';
import { AuditModule } from './modules/audit/audit.module';
import { ExportModule } from './modules/export/export.module';
import { StatsModule } from './modules/stats/stats.module';
import { QueueModule } from './queue/queue.module';
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/survey_system'),
    QueueModule,
    OrgModule,
    TemplatesModule,
    SurveysModule,
    ResponsesModule,
    RecycleModule,
    AuditModule,
    ExportModule,
    StatsModule,
  ],
})
export class AppModule {}