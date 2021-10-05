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
import { LoginUserDTO } from './dto/login.dto';
import { RegisterUserDTO } from './dto/register.dto';
import { LocalAuthGuard } from './guard/local.auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiOperation({
    summary: 'Login user',
    description: 'Some description here...',
  })
  @ApiBasicAuth()
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
    summary: 'Refresh token',
    description:
      'Nothing to include in the request body the api will automatically read request cookies and validate.',
  })
  @ApiCookieAuth()
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

  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');

    return {
      message: 'Logout successfully,',
    };
  }
}
