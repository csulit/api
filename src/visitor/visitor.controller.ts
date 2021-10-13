import {
  Body,
  Controller,
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
import { CreateVisitorDTO } from './dto/create-visitor.dto';
import { VisitorService } from './visitor.service';

@ApiTags('Visitor')
@Controller('visitors')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

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
  clearVisitor(@Query('visitId', new ParseUUIDPipe()) visitId: string) {
    return this.visitorService.clearVisitor(visitId);
  }
}
