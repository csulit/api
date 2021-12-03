import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { VmsController } from './vms.controller';
import { VmsService } from './vms.service';

@Module({
  imports: [PrismaClientModule, EmailModule],
  controllers: [VmsController],
  providers: [VmsService],
})
export class VmsModule {}
