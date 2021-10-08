import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SurveyService } from './survey.service';

@ApiTags('Survey')
@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @ApiOperation({
    summary: 'All survey questions',
    description: 'Some description here...',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully returned all survey questions.',
  })
  @Get()
  getAllSurveys() {
    return this.surveyService.getAllSurveys();
  }
}
