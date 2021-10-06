import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import authEnv from './common/config/auth.config';
import emailEnv from './common/config/email.config';
import { EmailModule } from './email/email.module';
import { PrismaClientModule } from './prisma-client/prisma-client.module';
import { VisitorModule } from './visitor/visitor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authEnv, emailEnv],
    }),
    PrismaClientModule,
    AuthenticationModule,
    VisitorModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
