import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department, DepartmentDocument } from './schemas/department.schema';
import { AuditService } from '../../../audit/audit.service';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name) private deptModel: Model<DepartmentDocument>,
    private readonly auditSvc: AuditService,
  ) {}

  async create(orgId: string, payload: Partial<Department>, userId?: string) {
    const doc = new this.deptModel({ ...payload, orgId, createdBy: userId });
    const saved = await doc.save();
    await this.auditSvc.log(orgId, userId, 'department.create', 'department', saved._id.toString(), { name: saved.name });
    return saved;
  }

  async list(orgId: string, filter: any = {}, skip = 0, limit = 20) {
    const q = { orgId, isDeleted: false, ...filter };
    const [items, total] = await Promise.all([
      this.deptModel.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.deptModel.countDocuments(q),
    ]);
    return { data: items, total, skip, limit };
  }

  async tree(orgId: string) {
    const items = await this.deptModel.find({ orgId, isDeleted: false }).lean();
    const map = new Map<string, any>();
    items.forEach((it) => map.set(it._id.toString(), { ...it, children: [] }));
    const roots: any[] = [];
    for (const it of items) {
      const id = it._id.toString();
      const parentId = it.parentId ? it.parentId.toString() : null;
      if (parentId && map.has(parentId)) {
        map.get(parentId).children.push(map.get(id));
      } else {
        roots.push(map.get(id));
      }
    }
    return roots;
  }

  async findById(id: string) {
    const d = await this.deptModel.findById(id);
    if (!d) throw new NotFoundException('Department not found');
    return d;
  }

  async update(id: string, payload: Partial<Department>, userId?: string) {
    const d = await this.deptModel.findByIdAndUpdate(id, payload, { new: true });
    await this.auditSvc.log(d.orgId, userId, 'department.update', 'department', d._id.toString(), payload);
    return d;
  }

  async softDelete(id: string, userId?: string) {
    const d = await this.findById(id);
    d.isDeleted = true;
    d.deletedAt = new Date();
    d.deletedBy = userId;
    await d.save();
    await this.auditSvc.log(d.orgId, userId, 'department.soft_delete', 'department', d._id.toString());
    return d;
  }

  async restore(id: string, userId?: string) {
    const d = await this.findById(id);
    d.isDeleted = false;
    d.deletedAt = null;
    d.deletedBy = null;
    await d.save();
    await this.auditSvc.log(d.orgId, userId, 'department.restore', 'department', d._id.toString());
    return d;
  }

  async permanentDelete(id: string, userId?: string) {
    const d = await this.findById(id);
    // TODO: implement cascade or reassign child departments policy
    await this.deptModel.deleteOne({ _id: d._id });
    await this.auditSvc.log(d.orgId, userId, 'department.permanent_delete', 'department', d._id.toString());
    return { ok: true };
  }
}
