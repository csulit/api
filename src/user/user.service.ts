import { Injectable, NotFoundException } from '@nestjs/common';
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
        isClientAccess: true,
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

  async lockUser(email: string) {
    const user = await this.prismaClientService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('No visitor found.');
    }

    return await this.prismaClientService.user.update({
      where: { email },
      data: {
        isLocked: true,
      },
      select: {
        id: true,
        email: true,
        isLocked: true,
      },
    });
  }

  async unlockUser(email: string) {
    const user = await this.prismaClientService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('No visitor found.');
    }

    return await this.prismaClientService.user.update({
      where: { email },
      data: {
        isLocked: false,
      },
      select: {
        id: true,
        email: true,
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

  async deleteQrCode(qrCodeId: string) {
    return await this.prismaClientService.userQrCode.delete({
      where: { id: qrCodeId },
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
