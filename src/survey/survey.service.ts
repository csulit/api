import { Injectable } from '@nestjs/common';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class SurveyService {
  constructor(private prismaClientService: PrismaClientService) {}

  async getAllSurveys() {
    return await this.prismaClientService.survey.findMany({
      orderBy: {
        surveyOrder: 'asc',
      },
    });
  }
}
