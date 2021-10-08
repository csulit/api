import { Module } from '@nestjs/common';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';

@Module({
  imports: [PrismaClientModule],
  controllers: [SurveyController],
  providers: [SurveyService],
})
export class SurveyModule {}
