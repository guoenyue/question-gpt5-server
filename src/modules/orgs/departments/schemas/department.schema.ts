import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DepartmentDocument = Department & Document;

@Schema({ timestamps: true })
export class Department {
  @Prop({ required: true })
  orgId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  code?: string;

  @Prop({ default: null })
  parentId?: string | null;

  @Prop({ type: Object, default: {} })
  metadata?: Record<string, any>;

  @Prop()
  managerId?: string;

  @Prop()
  createdBy?: string;

  @Prop({ default: false })
  isDeleted?: boolean;

  @Prop()
  deletedAt?: Date;

  @Prop()
  deletedBy?: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
