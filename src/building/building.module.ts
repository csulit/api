import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BuildingController } from './building.controller';
import { BuildingService } from './building.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('erp-api.ERP_API_BASE_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [BuildingController],
  providers: [BuildingService],
})
export class BuildingModule {}
