import { Prisma, User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { CreateVisitorDTO } from './dto/create-visitor.dto';

@Injectable()
export class VisitorService {
  constructor(
    private prismaClientService: PrismaClientService,
    private emailService: EmailService,
  ) {}

  private async visitDetails(data: {
    visitorId: string;
    guest?: boolean;
    event?: boolean;
  }) {
    const { visitorId, guest, event } = data;

    return await this.prismaClientService.visitor.findUnique({
      where: { id: visitorId },
      select: {
        id: true,
        date: true,
        clear: true,
        user: {
          select: {
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                phoneNumber: true,
                address: true,
                company: true,
              },
            },
          },
        },
        guest: guest,
        event: event,
        travelHistory: true,
        locations: true,
        survey: true,
        symptoms: true,
      },
    });
  }

  async createVisitor(data: CreateVisitorDTO) {
    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      address,
      company,
      workType,
      travelHistory,
      locations,
      answers,
      symptoms,
      dataPrivacyPolicyIsAccepted,
    } = data;

    const hasVisitToday = await this.prismaClientService.visitor.findFirst({
      where: {
        AND: [
          { user: { email } },
          {
            date: {
              lte: new Date(Date.now()),
              gte: new Date(Date.now()),
            },
          },
        ],
      },
      select: {
        id: true,
        date: true,
        clear: true,
        user: {
          select: {
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                phoneNumber: true,
                address: true,
                company: true,
              },
            },
          },
        },
        guest: true,
        event: true,
        travelHistory: true,
        locations: true,
        survey: true,
        symptoms: true,
      },
    });

    if (hasVisitToday) {
      console.log('hhehe');

      return hasVisitToday;
    }

    let newUser: User;

    const user = await this.prismaClientService.user.findUnique({
      where: { email },
    });
    const profile = await this.prismaClientService.profile.findFirst({
      where: { user: { id: user?.id } },
    });

    // Check if user and profile does not exists.
    if (!user && !profile) {
      const hashedPassword = await hash('Love2eat', 10);

      newUser = await this.prismaClientService.user.create({
        data: {
          email,
          password: hashedPassword,
          profile: {
            create: {
              firstName,
              lastName,
              phoneNumber,
              address,
              company,
            },
          },
        },
      });
    }

    // User exists but no profile.
    if (user && !profile) {
      await this.prismaClientService.profile.create({
        data: {
          user: { connect: { id: user.id || newUser.id } },
          firstName,
          lastName,
          phoneNumber,
          address,
          company,
        },
      });
    }

    const hasSymptoms =
      symptoms.length > 1 || symptoms[0] !== 'None of the above';
    const answeredYes =
      answers.filter((ans) => ans?.value === 'Yes').length < 1;

    const visitorIsClear = hasSymptoms || answeredYes;

    const isGuest =
      data?.personToVisit && data?.personVisitEmail && data?.purposeOfVisit;

    const isEvent = data?.eventId;

    const visitor = await this.prismaClientService.visitor.create({
      data: {
        clear: visitorIsClear,
        user: { connect: { id: newUser?.id || user?.id } },
        travelHistory,
        workType,
        leaveType: data?.leaveType || null,
        locations: locations as unknown as Prisma.JsonArray,
        survey: answers,
        symptoms,
        dataPrivacyPolicyIsAccepted,
      },
    });

    if (isGuest && visitorIsClear) {
      await this.prismaClientService.guest.create({
        data: {
          visitor: { connect: { id: visitor.id } },
          personToVisit: data.personToVisit,
          personToVisitEmail: data.personVisitEmail,
          purposeOfVisit: data.purposeOfVisit,
        },
      });

      await this.emailService.sendEmail({
        to: data.personVisitEmail,
        subject: 'You have a visitor!',
        body: `
            <p>Name: ${firstName} ${lastName}</p>
            <p>Purpose of visit: ${data.purposeOfVisit}</p>
            <p>Approval link: ${123}</p>
          `,
      });

      return {
        message: 'You will received an email after he/she approved your visit.',
      };
    }

    if (isEvent && visitorIsClear) {
      await this.prismaClientService.visitor.update({
        where: { id: visitor.id },
        data: { event: { connect: { id: isEvent } } },
      });

      await this.emailService.sendEmail({
        to: 'christian.sulit@kmc.solutions',
        subject: 'May visitor ka teh!',
        body: `Test`,
      });

      return await this.visitDetails({ visitorId: visitor.id, event: true });
    }

    if (!visitorIsClear) {
      await this.emailService.sendEmail({
        to: 'christian.sulit@kmc.solutions',
        subject: 'May covid ata to teh!',
        body: `Test`,
      });

      return {
        message: "it's better to stay at home for now.",
      };
    }

    await this.emailService.sendEmail({
      to: email,
      subject: 'Visitor details!',
      body: `Test`,
    });

    return await this.visitDetails({ visitorId: visitor.id });
  }

  async lastVisit(userId: string) {
    return await this.prismaClientService.visitor.findFirst({
      where: { user: { id: userId } },
      select: {
        id: true,
        clear: true,
        user: {
          select: {
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                phoneNumber: true,
                address: true,
                company: true,
              },
            },
          },
        },
        guest: true,
        event: true,
        travelHistory: true,
        locations: true,
        survey: true,
        symptoms: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async clearVisitor(visitId: string) {
    return await this.prismaClientService.visitor.update({
      where: { id: visitId },
      data: { clear: true },
      select: {
        id: true,
        clear: true,
      },
    });
  }
}
