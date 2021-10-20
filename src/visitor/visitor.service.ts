import { Prisma, User } from '.prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { CreateVisitorDTO } from './dto/create-visitor.dto';

@Injectable()
export class VisitorService {
  private titleHead: string;

  constructor(
    private prismaClientService: PrismaClientService,
    private emailService: EmailService,
  ) {
    this.titleHead = `
      <p>
        In light of the recent news concerning the COVID-19 virus, KMC Solutions will be taking further additional steps to ensure the safety and health of the KMC Community. Kindly fill out our self-declaration form for visitors and members to declare recent travel and health status. For our Privacy Policy Statement, please click the link - https://kmc.solutions/privacy-policy
      </p>
      <p>
        I hereby authorize KMC Solutions to collect and process the data indicated herein for the purpose of effecting control of the COVID-19 infection. I understand that my personal information is protected by RA 10173, Data Privacy Act of 2012, and that I am required by RA 11469, Bayanihan to Heal as One Act, to provide truthful information.
      </p>
    `;
  }

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
      travelHistory,
      locations,
      answers,
      symptoms,
      dataPrivacyPolicyIsAccepted,
    } = data;

    let newUser: User;

    const user = await this.prismaClientService.user.findUnique({
      where: { email },
    });

    if (user.isLocked) {
      throw new BadRequestException(
        'You are not allowed to enter any kmc premises.',
      );
    }

    // Check if user and profile does not exists.
    if (!user) {
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

      await this.prismaClientService.profile.create({
        data: {
          user: { connect: { id: user?.id || newUser?.id } },
          firstName,
          lastName,
          phoneNumber,
          address,
          company,
        },
      });
    }

    const lastVisitIsNotClear =
      await this.prismaClientService.visitor.findFirst({
        where: { AND: [{ user: { email } }, { clear: false }] },
        orderBy: {
          createdAt: 'desc',
        },
      });

    if (lastVisitIsNotClear) {
      throw new BadRequestException(
        'Your last visit is not yet cleared by the admin.',
      );
    }

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
      return hasVisitToday;
    }

    const hasSymptoms =
      symptoms.length > 1 || symptoms[0] === 'None of the above';
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
        workType: data?.workType,
        leaveType: data?.leaveType,
        locations: locations as unknown as Prisma.JsonArray,
        survey: data?.answers,
        symptoms: data?.symptoms,
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
        message: 'You will received an email after your visit is approved.',
      };
    }

    if (isEvent && visitorIsClear) {
      await this.prismaClientService.visitor.update({
        where: { id: visitor.id },
        data: { event: { connect: { id: isEvent } } },
      });

      await this.emailService.sendEmail({
        to: email,
        subject: 'You have a visitor',
        body: `Test`,
      });

      return await this.visitDetails({ visitorId: visitor.id, event: true });
    }

    if (!visitorIsClear) {
      await this.emailService.sendEmail({
        to: 'christian.sulit@kmc.solutions',
        subject: 'Stay at home',
        body: `Test`,
      });

      return {
        message: "it's better to stay at home for now.",
      };
    }

    await this.emailService.sendEmail({
      to: email,
      subject: 'Member',
      body: `
      ${this.titleHead}

      <p>
        <b>Date of Visit:</b> 2021-09-07
      </p>

      <p>
        <b>Full Name:</b> ${firstName} ${lastName}
      </p>

      <p>
        <b>Email:</b> ${email}
      </p>

      <p>
       <b>Company:</b> ${company}
      </p>

      <p>
        <b>Site:</b> ${1}
      </p>

      <p>
        <b>Status:</b> ${visitor.clear ? 'Clear' : 'Not clear'}
      </p>
      `,
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
