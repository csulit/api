import {
  Body,
  Controller,
  Get,
  Param,
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
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/authentication/guard/jwt.guard';
import { ClearNotesDTO } from './dto/clear-notes.dto';
import { CreateVisitorDTO } from './dto/create-visitor.dto';
import { GuestApprovalBodyDTO } from './dto/guest-approval-body.dto';
import { GuestApprovalQueryDTO } from './dto/guest-approval-query.dto';
import { VisitType, VisitTypeQueryDTO } from './dto/visit-type.dto';
import { VisitorTemperatureDTO } from './dto/visitor-temperature.dto';
import { VisitorsDTO } from './dto/visitors.dto';
import { VisitorService } from './visitor.service';

@ApiTags('Visitor')
@Controller('visitors')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Get visitors',
    description: 'Some description here...',
  })
  @ApiResponse({
    status: 200,
    description: 'Visitors.',
  })
  @Get()
  getVisitors(@Query() query: VisitorsDTO) {
    return this.visitorService.getVisitors(
      {
        _search: query?._search,
        _dateStart: query?._dateStart,
        _dateEnd: query?._dateEnd,
      },
      {
        page: query?.page,
        limit: query?.limit,
      },
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Get one visit',
    description: 'Some description here...',
  })
  @ApiParam({
    name: 'visitorId',
    type: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Visit details.',
  })
  @Get('visit/:visitorId')
  getOneVisit(
    @Param('visitorId', new ParseUUIDPipe()) visitorId: string,
    @Query() { type }: VisitTypeQueryDTO,
  ) {
    return this.visitorService.getOneVisit({
      visitorId,
      event: type === VisitType.Event,
      guest: type === VisitType.Guest,
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Last visit',
    description: 'Some description here...',
  })
  @ApiQuery({
    type: 'uuid',
    name: 'userId',
  })
  @ApiResponse({
    status: 200,
    description: 'Visitor last visit.',
  })
  @Get('last-visit')
  lastVisit(@Query('userId', new ParseUUIDPipe()) userId: string) {
    return this.visitorService.lastVisit(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Create visit',
    description: 'Some description here...',
  })
  @ApiBody({ type: CreateVisitorDTO })
  @ApiResponse({
    status: 201,
    description: 'Successfully created visit.',
  })
  @ApiResponse({
    status: 400,
    description: 'May mali talaga eh.',
  })
  @Post()
  createVisitor(@Body() data: CreateVisitorDTO) {
    return this.visitorService.createVisitor(data);
  }

  @ApiOperation({
    summary: 'Guest approval',
    description: 'Some description here...',
  })
  @ApiResponse({
    status: 200,
    description: 'Approval action accepted.',
  })
  @Patch('guest-approval')
  guestApproval(
    @Query() { visitorId }: GuestApprovalQueryDTO,
    @Body() { isApproved }: GuestApprovalBodyDTO,
  ) {
    return this.visitorService.guestApproval(visitorId, isApproved);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Clear last visit',
    description: 'Some description here...',
  })
  @ApiQuery({
    type: 'uuid',
    name: 'visitId',
  })
  @ApiResponse({
    status: 200,
    description: 'Cleared visitor last visit.',
  })
  @Patch('clear')
  clearVisitor(
    @Query('visitId', new ParseUUIDPipe()) visitId: string,
    @Body() data: ClearNotesDTO,
  ) {
    return this.visitorService.clearVisitor(visitId, data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Add visitor temperature',
    description: 'Some description here...',
  })
  @ApiQuery({
    type: 'uuid',
    name: 'userId',
  })
  @ApiResponse({
    status: 200,
    description: 'Added visitor temperature.',
  })
  @Post('temperature')
  addTemperature(
    @Query('userId', new ParseUUIDPipe()) userId: string,
    @Body() { temperature }: VisitorTemperatureDTO,
  ) {
    return this.visitorService.addTemperature(userId, temperature);
  }
}
