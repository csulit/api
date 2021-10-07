import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { LoginUserClass } from './classes/login.classes';
import { EmailDTO } from './dto/email.dto';
import { LoginUserDTO } from './dto/login.dto';
import { OtpAuthDTO } from './dto/otp-auth.dto';
import { RegisterUserDTO } from './dto/register.dto';
import { LocalAuthGuard } from './guard/local.auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiBasicAuth()
  @ApiOperation({
    summary: 'Login user',
    description: 'Some description here...',
  })
  @ApiBody({ type: LoginUserDTO })
  @ApiResponse({
    status: 200,
    description: 'User successfully login.',
    type: () => LoginUserClass,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { id, email } = req.user;

    await this.authenticationService.setClientCookies(id, res);

    return {
      id,
      email,
    };
  }

  @ApiOperation({
    summary: 'Register user',
    description:
      'If api successfully created the user the access token will be available in the cookie.',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully created.',
    type: () => LoginUserClass,
  })
  @ApiResponse({
    status: 400,
    description: 'Duplicate user.',
  })
  @Post('register')
  async register(
    @Body() data: RegisterUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authenticationService.register(data);

    await this.authenticationService.setClientCookies(user.id, res);

    return user;
  }

  @ApiOperation({
    summary: 'Send OTP via email',
    description: 'This will send an OTP code to the user.',
  })
  @ApiResponse({
    status: 200,
    description: 'OTP code successfully sent.',
  })
  @Post('otp-code')
  @HttpCode(200)
  sendOtpCode(@Body() data: EmailDTO) {
    return this.authenticationService.sendOtpCode(data.email);
  }

  @ApiOperation({
    summary: 'Authenticate via OTP',
    description: 'This will authenticate user using OTP.',
  })
  @ApiResponse({
    status: 200,
    description: 'OTP code successfully validated.',
  })
  @ApiResponse({
    status: 401,
    description: 'OTP has expired or not found.',
  })
  @Post('otp-auth')
  @HttpCode(200)
  async otpAuth(
    @Body() data: OtpAuthDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authenticationService.otpAuth(data);

    await this.authenticationService.setClientCookies(user.id, res);

    return user;
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Refresh token',
    description:
      'Nothing to include in the request body the api will automatically read request cookies and validate.',
  })
  @ApiResponse({
    status: 200,
    description: 'Access token has been refreshed.',
  })
  @ApiResponse({
    status: 404,
    description: 'No user or refresh token found.',
  })
  @ApiResponse({
    status: 401,
    description: "Refresh token is expired or it's been revoked.",
  })
  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const validatedRefreshToken =
      await this.authenticationService.validateRefreshToken(
        req.cookies['refreshToken'],
        res,
      );

    return validatedRefreshToken;
  }

  @ApiOperation({
    summary: 'Logout',
    description:
      'Will clear access token and refresh token in the client browser.',
  })
  @ApiResponse({
    status: 200,
    description: 'User logout successfully.',
  })
  @Post('logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.authenticationService.clearTokens(res);

    return {
      message: 'Logout successfully,',
    };
  }
}
