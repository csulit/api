import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventClass } from './classes/event.classes';
import { CreateEventDTO } from './dto/create-event.dto';
import { EventService } from './event.service';

@ApiTags('Event')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiOperation({
    summary: 'Event list',
    description: 'Some description here...',
  })
  @ApiResponse({
    status: 200,
    description: 'Event list.',
    type: () => EventClass,
  })
  @Get()
  getEvents() {
    return this.eventService.getEvents();
  }

  @ApiOperation({
    summary: 'Create event',
    description: 'Some description here...',
  })
  @ApiBody({ type: CreateEventDTO })
  @ApiResponse({
    status: 201,
    description: 'Event successfully created.',
    type: () => EventClass,
  })
  @Post()
  createEvent(@Body() data: CreateEventDTO) {
    return this.eventService.createEvent(data);
  }
}
