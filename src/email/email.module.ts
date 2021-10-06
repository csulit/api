import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('ERP_BASE_URL'),
        url: configService.get('ERP_EMAIL_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
})
export class EmailModule {}
