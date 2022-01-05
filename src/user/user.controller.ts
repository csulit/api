import {
  Body,
  Controller,
  Delete,
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
import { EmailDTO } from 'src/authentication/dto/email.dto';
import { JwtAuthGuard } from 'src/authentication/guard/jwt.guard';
import { User } from './classes/user.classes';
import { CreateQrCodeDTO } from './dto/create-qrcode.dto';
import { UpdateProfileDTO } from './dto/update-profile.dto';
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
    summary: 'Get user qr codes',
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
    summary: 'Delete qr code',
    description: 'Some description here...',
  })
  @ApiQuery({
    type: 'uuid',
    name: 'qrCodeId',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted qr codes.',
  })
  @Delete('qr-codes')
  deleteQrCodes(@Query('qrCodeId', new ParseUUIDPipe()) qrCodeId: string) {
    return this.userService.deleteQrCode(qrCodeId);
  }

  @ApiOperation({
    summary: 'Update user profile',
    description: 'Some description here...',
  })
  @ApiBody({ type: UpdateProfileDTO })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated user profile.',
  })
  @Patch('profile')
  updateProfile(@Req() req: Request, @Body() data: UpdateProfileDTO) {
    return this.userService.updateProfile(req.user.id, data);
  }

  @ApiOperation({
    summary: 'Lock user',
    description: 'Some description here...',
  })
  @ApiQuery({
    type: 'string',
    name: 'email',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully lock user.',
  })
  @Patch('lock')
  lockUser(@Query() { email }: EmailDTO) {
    return this.userService.lockUser(email);
  }

  @ApiOperation({
    summary: 'Unlock user',
    description: 'Some description here...',
  })
  @ApiQuery({
    type: 'string',
    name: 'email',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully unlock user.',
  })
  @Patch('unlock')
  unLockUser(@Query() { email }: EmailDTO) {
    return this.userService.unlockUser(email);
  }
}
