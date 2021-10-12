import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { CreateVisitorDTO } from './dto/create-visitor.dto';

@Injectable()
export class VisitorService {
  constructor(private prismaClientService: PrismaClientService) {}

  async createVisitor(data: CreateVisitorDTO) {
    const { email } = data;

    await this.prismaClientService.$transaction(async (prisma) => {
      let newUser: User;
      const user = await prisma.user.findUnique({ where: { email } });

      // Check if user does not exists.
      if (!user) {
        const hashedPassword = await hash('Love2eat', 10);

        newUser = await prisma.user.create({
          data: { email, password: hashedPassword },
        });
      }

      return prisma;
    });

    return data;
  }

  async lastVisit() {
    return null;
  }

  async clearVisitor(visitId: string) {
    return await this.prismaClientService.visitor.update({
      where: { id: visitId },
      data: { clear: true },
    });
  }
}
