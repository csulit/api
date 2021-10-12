import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { CreateVisitorDTO } from './dto/create-visitor.dto';

@Injectable()
export class VisitorService {
  constructor(private prismaClientService: PrismaClientService) {}

  async createVisitor(data: CreateVisitorDTO) {
    const { email, travelHistory, locations, answers, symptoms } = data;

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

      const hasSymptoms =
        symptoms.length > 1 || symptoms[0] !== 'None of the above';
      const answeredYes =
        answers.filter((ans) => ans?.value === 'Yes').length < 1;

      const visitorIsClear = hasSymptoms || answeredYes;

      const visitor = await this.prismaClientService.visitor.create({
        data: {
          clear: visitorIsClear,
          user: { connect: { id: user?.id || newUser?.id } },
          travelHistory,
          dataPrivacyPolicyIsAccepted: true,
          locations,
          survey: answers,
          symptoms,
        },
      });

      if (data?.personToVisit) {
        await prisma.guest.create({
          data: {
            visitorId: visitor.id,
            personToVisit: data.personToVisit,
            personToVisitEmail: data.personVisitEmail,
            purposeOfVisit: data.purposeOfVisit,
          },
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
