import { Module } from '@nestjs/common';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { VisitorController } from './visitor.controller';
import { VisitorService } from './visitor.service';

@Module({
  imports: [PrismaClientModule],
  controllers: [VisitorController],
  providers: [VisitorService],
})
export class VisitorModule {}
