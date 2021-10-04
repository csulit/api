import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { cookieConfig } from './config/cookie.config';
import { RegisterUserDTO } from './dto/register.dto';
import { LocalAuthGuard } from './guard/local.auth.guard';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { id, email, isLocked } = req.user;

    const fifteenMinutes = 900000;
    const sevenDays = 6.048e8;

    const accessToken = await this.authenticationService.signAccessToken(id);
    const refreshToken = await this.authenticationService.createRefreshToken(
      id,
    );

    res.cookie('accessToken', accessToken, cookieConfig(fifteenMinutes));
    res.cookie('refreshToken', refreshToken, cookieConfig(sevenDays));

    return {
      id,
      email,
      isLocked,
    };
  }

  @Post('register')
  register(@Body() data: RegisterUserDTO) {
    //PmAc2G6qp53hUz4q
    //https://www.npmjs.com/package/nestjs-redoc

    return this.authenticationService.register(data);
  }

  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken() {
    return 'Token refreshed';
  }
}
