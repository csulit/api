import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
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
import { Request } from 'express';
import { JwtAuthGuard } from 'src/authentication/guard/jwt.guard';
import { User } from './classes/user.classes';
import { CreateQrCodeDTO } from './dto/create-qrcode.dto';
import { UserService } from './user.service';

@ApiTags('User')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Current user information',
    description: 'Some description here...',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully return current user information.',
    type: () => User,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @Get('me')
  me(@Req() req: Request) {
    return this.userService.getOneUser(req.user.id);
  }

  @ApiOperation({
    summary: 'Qr codes',
    description: 'Some description here...',
  })
  @ApiQuery({
    type: 'uuid',
    name: 'userId',
  })
  @ApiResponse({
    status: 200,
    description: 'User qr codes.',
  })
  @Get('qr-codes')
  getQrCodes(@Query('userId', new ParseUUIDPipe()) userId: string) {
    return this.userService.getQrCodes(userId);
  }

  @ApiOperation({
    summary: 'Create qr code',
    description: 'Some description here...',
  })
  @ApiBody({ type: CreateQrCodeDTO })
  @ApiResponse({
    status: 201,
    description: 'Successfully created qr codes.',
  })
  @Post('qr-codes')
  createQrCodes(@Req() req: Request, @Body() data: CreateQrCodeDTO) {
    return this.userService.createQrCodes(req.user.id, data);
  }

  @ApiOperation({
    summary: 'Update user profile',
    description: 'Some description here...',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated user profile.',
  })
  @Patch('profile')
  updateProfile(@Req() req: Request, @Body() data: any) {
    return this.userService.updateProfile(req.user.id, data);
  }
}
