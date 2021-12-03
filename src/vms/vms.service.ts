import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { CreateVmsVisitorDTO } from './dto/create-vms-visitor.dto';

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

  async createVmsVisitor(data: CreateVmsVisitorDTO) {
    return await this.prismaClientService.vmsVisitor.create({
      data: { ...data, body: '' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        companyToVisit: true,
        personToVisit: true,
        reasonOfVisit: true,
        imageUrl: true,
        site: true,
        floor: true,
      },
    });
  }
}
