import { Injectable } from '@nestjs/common';
import { SurveysService } from '../surveys/surveys.service';
import { ResponsesService } from '../responses/responses.service';
@Injectable()
export class RecycleService {
  constructor(private readonly surveysSvc: SurveysService, private readonly responsesSvc: ResponsesService) {}
  async list(orgId: string, skip = 0, limit = 20, type?: 'survey' | 'response') {
    const result: any = { surveys: [], responses: [], total: 0 };
    if (!type || type === 'survey') {
      const [surveys, surveysCount] = await Promise.all([
        this.surveysSvc['surveyModel'].find({ orgId, isDeleted: true }).sort({ deletedAt: -1 }).skip(skip).limit(limit),
        this.surveysSvc['surveyModel'].countDocuments({ orgId, isDeleted: true }),
      ]);
      result.surveys = surveys;
      result.total = result.total + surveysCount;
    }
    if (!type || type === 'response') {
      const [responses, responsesCount] = await Promise.all([
        this.responsesSvc['respModel'].find({ orgId, isDeleted: true }).sort({ deletedAt: -1 }).skip(skip).limit(limit),
        this.responsesSvc['respModel'].countDocuments({ orgId, isDeleted: true }),
      ]);
      result.responses = responses;
      result.total = result.total + responsesCount;
    }
    return result;
  }
  async restoreSurvey(id: string, userId?: string) {
    return this.surveysSvc.restore(id, userId);
  }
  async permanentSurvey(id: string, userId?: string) {
    return this.surveysSvc.permanentDelete(id, userId);
  }
  async restoreResponse(id: string, userId?: string) {
    return this.responsesSvc.restore(id, userId);
  }
  async permanentResponse(id: string, userId?: string) {
    const res = await this.responsesSvc['respModel'].deleteOne({ _id: id });
    await this.responsesSvc['auditSvc'].log(null, userId, 'response.permanent_delete', 'response', id);
    return res;
  }
}