import { Injectable } from '@nestjs/common';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { CreateQrCodeDTO } from './dto/create-qrcode.dto';
import { UpdateProfileDTO } from './dto/update-profile.dto';

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
            company: true,
          },
        },
        isLocked: true,
      },
    });
  }

  async getQrCodes(userId: string) {
    return await this.prismaClientService.userQrCode.findMany({
      where: { userId },
    });
  }

  async createQrCodes(userId: string, data: CreateQrCodeDTO) {
    return await this.prismaClientService.userQrCode.create({
      data: { user: { connect: { id: userId } }, ...data },
    });
  }

  async updateProfile(userId: string, data: UpdateProfileDTO) {
    const user = await this.prismaClientService.user.findUnique({
      where: { id: userId },
      select: { profile: true },
    });

    return await this.prismaClientService.profile.update({
      where: { id: user.profile.id },
      data,
    });
  }
}
