import { IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  parentId?: string | null;

  @IsOptional()
  @IsString()
  managerId?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
