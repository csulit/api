import { Prisma } from '.prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { PaginationDTO } from 'src/common/dto/paging.dto';
import { paginate } from 'src/common/utils/paginate.utils';
import { EmailService } from 'src/email/email.service';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { ClearNotesDTO } from './dto/clear-notes.dto';
import { CreateVisitorDTO } from './dto/create-visitor.dto';
import { VisitorsDTO } from './dto/visitors.dto';

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

  async getVisitors(filter?: VisitorsDTO, _paging?: PaginationDTO) {
    const { _search, _dateStart, _dateEnd } = filter;

    const { page, limit, skip } = paginate(_paging?.page, _paging?.limit);

    const searchFilter =
      _search && _search.split(' ').length
        ? _search.split(' ').join(' | ')
        : _search;

    const searchCondition = {
      date: {
        gte: _dateStart ? new Date(_dateStart) : undefined,
        lte: _dateEnd ? new Date(_dateEnd) : undefined,
      },
      body: {
        search: searchFilter,
      },
    };

    const visitors = await this.prismaClientService.$transaction([
      this.prismaClientService.visitor.findMany({
        skip,
        take: limit,
        where: searchCondition,
        select: {
          id: true,
          clear: true,
          guest: true,
          event: true,
          user: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  address: true,
                  company: true,
                  phoneNumber: true,
                  fullName: true,
                },
              },
            },
          },
          locations: true,
          createdAt: true,
        },
      }),
      this.prismaClientService.visitor.count({
        where: searchCondition,
      }),
    ]);

    return {
      data: visitors[0],
      pagination: {
        page,
        limit,
        count: visitors[1],
      },
    };
  }

  async getOneVisit(data: {
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
        workType: guest || event ? false : true,
        leaveType: guest || event ? false : true,
        user: {
          select: {
            id: true,
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
      createdAt,
    } = data;

    const user = await this.prismaClientService.user.findUnique({
      where: { email },
    });

    if (user?.isLocked) {
      throw new BadRequestException(
        'You are not allowed to enter any kmc premises.',
      );
    }

    if (!user?.profileId) {
      await this.prismaClientService.profile.create({
        data: {
          user: { connect: { id: user?.id } },
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

    function siteLocation() {
      if (visitor?.locations && !visitor.locations.length) return null;

      return `
        <b>Site:</b>
        <ul>
          ${visitor?.locations.map((site) => {
            return `<li>${site['branchName']} ${site['floorName']}</li>`;
          })}
        </ul>
      `;
    }

    const hasNoSymptoms =
      Array.isArray(symptoms) &&
      symptoms.length &&
      symptoms[0] === 'None of the above';
    const answeredYes =
      Array.isArray(answers) &&
      answers.length &&
      answers.filter((ans) => ans?.value === 'Yes').length < 1;

    const visitorIsClear = hasNoSymptoms && answeredYes;

    const isGuest =
      data?.personToVisit && data?.personVisitEmail && data?.purposeOfVisit;

    const isEvent = data?.eventId;

    const visitor = await this.prismaClientService.visitor.create({
      data: {
        clear: visitorIsClear ? true : false,
        user: { connect: { id: user?.id } },
        travelHistory,
        workType: data?.workType,
        leaveType: data?.leaveType,
        locations: locations as unknown as Prisma.JsonArray,
        survey: data?.answers,
        symptoms: data?.symptoms,
        dataPrivacyPolicyIsAccepted,
        date: new Date(createdAt || Date.now()),
        createdAt: new Date(createdAt || Date.now()),
        body: `${firstName} ${lastName} ${data?.workType || ''} ${
          isGuest ? 'Guest' : 'Member'
        } ${isEvent ? 'Event' : ''} ${data?.leaveType || ''} ${
          data?.workType || ''
        } ${data?.leaveType || ''} ${
          locations.length && locations.map((x) => x.branchName).join(' ')
        } ${data?.symptoms.length && data.symptoms.map((x) => x).join(' ')} ${
          travelHistory || ''
        } ${
          data?.answers.length &&
          data.answers.map((x) => JSON.stringify(x)).join(' ')
        }`,
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
            <p>
              <b>Date of Visit:</b> ${format(
                new Date(visitor.createdAt),
                'MM-dd-yyyy',
              )}
            </p>
            <p>Name: ${firstName} ${lastName}</p>
            <p>Purpose of visit: ${data.purposeOfVisit}</p>
            ${siteLocation()}
            <p>Approval link: https://hdf-8svj2.ondigitalocean.app/guest?session=approval&visitorId=${
              visitor.id
            }</p>
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

      const { eventName } = await this.prismaClientService.event.findUnique({
        where: { id: isEvent },
      });

      await this.emailService.sendEmail({
        to: email,
        copy: 'christian.sulit@kmc.solutions',
        subject: 'You have a visitor',
        body: `
          <p>
            <b>Date of Visit:</b> ${format(
              new Date(visitor.createdAt),
              'MM-dd-yyyy',
            )}
          </p>
          <p>
            <b>Status:</b> Clear
          </p>
          <p>Name: ${firstName} ${lastName}</p>
          <p><b>Event name:</b> ${eventName}</p>
          ${siteLocation()}
        `,
      });

      return await this.getOneVisit({ visitorId: visitor.id, event: true });
    }

    if (!visitorIsClear) {
      await this.emailService.sendEmail({
        to: 'christian.sulit@kmc.solutions',
        subject: 'Stay at home',
        body: `
          <p>
            <b>Date of Visit:</b> ${format(
              new Date(visitor.createdAt),
              'MM-dd-yyyy',
            )}
          </p>
          <p>
            <b>Status:</b> Unclear
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
          ${siteLocation()}
        `,
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
          <b>Date of Visit:</b> ${format(
            new Date(visitor.createdAt),
            'MM-dd-yyyy',
          )}
        </p>
        <p>
          <b>Status:</b> Clear
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
        ${siteLocation()}
      `,
    });

    return await this.getOneVisit({ visitorId: visitor.id });
  }

  async lastVisit(userId: string) {
    return await this.prismaClientService.visitor.findFirst({
      where: { user: { id: userId } },
      select: {
        id: true,
        clear: true,
        workType: true,
        leaveType: true,
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
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async guestApproval(visitorId: string, isApproved: boolean) {
    const { visitor } = await this.prismaClientService.guest.findFirst({
      where: { visitor: { id: visitorId } },
      select: {
        isApproved: true,
        visitor: {
          select: {
            id: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    const guest = await this.prismaClientService.visitor.update({
      where: { id: visitorId },
      data: {
        guest: {
          update: {
            isApproved,
          },
        },
      },
    });

    if (isApproved) {
      await this.emailService.sendEmail({
        to: visitor.user.email,
        copy: 'christian.sulit@kmc.solutions',
        subject: 'Visit approved!',
        body: `
          <p>
            HDF Link: https://hdf-8svj2.ondigitalocean.app/guest?type=guest&visitorId=${visitor.id}
          </p>
        `,
      });
    }

    return guest;
  }

  async clearVisitor(visitId: string, data: ClearNotesDTO) {
    const { notes } = data;

    const visitor = await this.prismaClientService.visitor.findUnique({
      where: { id: visitId },
      select: {
        user: {
          select: {
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    await this.emailService.sendEmail({
      to: visitor.user.email,
      copy: 'christian.sulit@kmc.solutions',
      subject: 'Clear to visit',
      body: `Hi, ${visitor.user.profile.lastName} you are now clear to visit.`,
    });

    return await this.prismaClientService.visitor.update({
      where: { id: visitId },
      data: { clear: true, notes },
      select: {
        id: true,
        clear: true,
      },
    });
  }

  async getTemperatures(userId: string, _paging?: PaginationDTO) {
    const { page, limit, skip } = paginate(_paging?.page, _paging?.limit);

    const temperatures = await this.prismaClientService.$transaction([
      this.prismaClientService.temperature.findMany({
        skip,
        take: limit,
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prismaClientService.temperature.count(),
    ]);

    return {
      data: temperatures[0],
      pagination: {
        page,
        limit,
        count: temperatures[1],
      },
    };
  }

  async addTemperature(userId: string, temperature: string) {
    return await this.prismaClientService.temperature.create({
      data: { user: { connect: { id: userId } }, temperature },
      select: {
        id: true,
        temperature: true,
      },
    });
  }
}
