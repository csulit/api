import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { BuildingModule } from './building/building.module';
import authEnv from './common/config/auth.config';
import defaultEnv from './common/config/default.config';
import { EmailModule } from './email/email.module';
import { PrismaClientModule } from './prisma-client/prisma-client.module';
import { SurveyModule } from './survey/survey.module';
import { UserModule } from './user/user.module';
import { VisitorModule } from './visitor/visitor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authEnv, defaultEnv],
    }),
    PrismaClientModule,
    AuthenticationModule,
    UserModule,
    EmailModule,
    SurveyModule,
    VisitorModule,
    BuildingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
