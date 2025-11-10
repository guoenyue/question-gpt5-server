import { Controller, Get, Param, Post, Delete, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RecycleService } from './recycle.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CurrentUser } from '../../common/decorators/user.decorator';
@UseGuards(AuthGuard, RolesGuard)
@Controller('orgs/:orgId/recycle')
export class RecycleController {
  constructor(private readonly recycleSvc: RecycleService) {}
  @Roles('org_admin', 'org_owner')
  @Get()
  async list(@Param('orgId') orgId: string, @Query() query: PaginationDto & { type?: string }) {
    const skip = query.skip || 0;
    const limit = query.limit || 20;
    const type = query.type as any;
    return this.recycleSvc.list(orgId, skip, limit, type);
  }
  @Roles('org_admin', 'org_owner')
  @Post('survey/:id/restore')
  async restoreSurvey(@Param('id') id: string, @CurrentUser() user: any) {
    return this.recycleSvc.restoreSurvey(id, user?.id);
  }
  @Roles('org_admin', 'org_owner')
  @Delete('survey/:id/permanent')
  async permSurvey(@Param('id') id: string, @CurrentUser() user: any) {
    return this.recycleSvc.permanentSurvey(id, user?.id);
  }
  @Roles('org_admin', 'org_owner')
  @Post('response/:id/restore')
  async restoreResp(@Param('id') id: string, @CurrentUser() user: any) {
    return this.recycleSvc.restoreResponse(id, user?.id);
  }
  @Roles('org_admin', 'org_owner')
  @Delete('response/:id/permanent')
  async permResp(@Param('id') id: string, @CurrentUser() user: any) {
    return this.recycleSvc.permanentResponse(id, user?.id);
  }
}