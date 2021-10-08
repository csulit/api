import { Injectable } from '@nestjs/common';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class UserService {
  constructor(private prismaClientService: PrismaClientService) {}

  async getOneUser(id: string) {
    return await this.prismaClientService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        crmAccess: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            address: true,
            phoneNumber: true,
            organization: true,
          },
        },
        isLocked: true,
      },
    });
  }
}
