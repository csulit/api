import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/authentication/guard/jwt.guard';
import { User } from './classes/user.classes';
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
}
