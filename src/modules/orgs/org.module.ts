import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrgService } from './org.service';
import { OrgController } from './org.controller';
import { Org, OrgSchema } from './schemas/org.schema';
import { AuditModule } from '../../audit/audit.module';
import { DepartmentsModule } from './departments/departments.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Org.name, schema: OrgSchema }]), AuditModule, DepartmentsModule],
  providers: [OrgService],
  controllers: [OrgController],
  exports: [OrgService],
})
export class OrgModule {}
