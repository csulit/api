import { Injectable } from '@nestjs/common';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { CreateEventDTO } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(private prismaClientService: PrismaClientService) {}

  async getEvents() {
    return await this.prismaClientService.event.findMany();
  }

  async createEvent(data: CreateEventDTO) {
    return await this.prismaClientService.event.create({
      data: { ...data, eventDate: new Date(data.eventDate) },
    });
  }

  async closeEvent(eventId: string) {
    return await this.prismaClientService.event.update({
      where: { id: eventId },
      data: {
        eventActive: false,
      },
    });
  }

  async deleteEvent(eventId: string) {
    return await this.prismaClientService.event.delete({
      where: {
        id: eventId,
      },
    });
  }
}
