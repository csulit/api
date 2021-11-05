import {
  Body,
  Controller,
  Delete,
  Get,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/authentication/guard/jwt.guard';
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

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
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

  @ApiOperation({
    summary: 'Close event',
    description: 'Some description here...',
  })
  @ApiQuery({
    type: 'uuid',
    name: 'eventId',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully closed event.',
  })
  @Patch()
  closeEvent(@Query('eventId', new ParseUUIDPipe()) eventId: string) {
    return this.eventService.closeEvent(eventId);
  }

  @ApiOperation({
    summary: 'Delete event',
    description: 'Some description here...',
  })
  @ApiQuery({
    type: 'uuid',
    name: 'eventId',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted event.',
  })
  @Delete()
  deleteEvent(@Query('eventId', new ParseUUIDPipe()) eventId: string) {
    return this.eventService.deleteEvent(eventId);
  }
}
