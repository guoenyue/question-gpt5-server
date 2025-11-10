import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { AuthGuard } from '../../../../common/guards/auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../../common/decorators/user.decorator';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('orgs/:orgId/departments')
export class DepartmentsController {
  constructor(private readonly svc: DepartmentsService) {}

  @Roles('org_admin', 'editor')
  @Post()
  async create(@Param('orgId') orgId: string, @Body() body: CreateDepartmentDto, @CurrentUser() user: any) {
    return this.svc.create(orgId, body as any, user?.id);
  }

  @Roles('org_admin', 'editor', 'viewer')
  @Get()
  async list(@Param('orgId') orgId: string, @Query() query: PaginationDto) {
    return this.svc.list(orgId, {}, query.skip || 0, query.limit || 20);
  }

  @Roles('org_admin', 'editor', 'viewer')
  @Get('tree')
  async tree(@Param('orgId') orgId: string) {
    return this.svc.tree(orgId);
  }

  @Roles('org_admin', 'editor', 'viewer')
  @Get(':id')
  async get(@Param('orgId') orgId: string, @Param('id') id: string) {
    return this.svc.findById(id);
  }

  @Roles('org_admin', 'org_owner')
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateDepartmentDto, @CurrentUser() user: any) {
    return this.svc.update(id, body as any, user?.id);
  }

  @Roles('org_admin', 'org_owner')
  @Delete(':id')
  async softDelete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.svc.softDelete(id, user?.id);
  }

  @Roles('org_admin', 'org_owner')
  @Post(':id/restore')
  async restore(@Param('id') id: string, @CurrentUser() user: any) {
    return this.svc.restore(id, user?.id);
  }

  @Roles('org_admin', 'org_owner')
  @Delete(':id/permanent')
  async permanent(@Param('id') id: string, @CurrentUser() user: any) {
    return this.svc.permanentDelete(id, user?.id);
  }
}
