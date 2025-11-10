import { Body, Controller, Post, UseGuards, Param } from '@nestjs/common';
import { ExportService } from './export.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';
@UseGuards(AuthGuard, RolesGuard)
@Controller('orgs/:orgId/exports')
export class ExportController {
  constructor(private readonly svc: ExportService) {}
  @Roles('org_admin', 'editor')
  @Post('survey/:surveyId')
  async exportSurvey(@Param('orgId') orgId: string, @Param('surveyId') surveyId: string, @CurrentUser() user: any, @Body() body: any) {
    return this.svc.enqueueExport(orgId, surveyId, user?.id, body || {});
  }
}