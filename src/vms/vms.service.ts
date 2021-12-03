import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class VmsService {
  constructor(
    private prismaClientService: PrismaClientService,
    private emailService: EmailService,
  ) {}

  async getVmsConfig(configId: string) {
    return await this.prismaClientService.vmsConfig.findUnique({
      where: { id: configId },
    });
  }

  async createVmsVisitor() {
    return true;
  }
}
