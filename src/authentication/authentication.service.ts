import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { Response } from 'express';
import { EmailService } from 'src/email/email.service';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { cookieConfig } from './config/cookie.config';
import { RegisterUserDTO } from './dto/register.dto';
import { Jwt } from './interface/jwt.interface';

@Injectable()
export class AuthenticationService {
  private REFRESH_TOKEN_SECRET_KEY: string;
  private REFRESH_TOKEN_SECRET_KEY_EXPIRES_IN: string;
  private JWT_ISSUER: string;
  private FIFTEEN_MINUTES = 900000;

  constructor(
    private emailService: EmailService,
    private prismaClientService: PrismaClientService,
    private jwtService: JwtService,
    private config: ConfigService<{
      auth: {
        REFRESH_TOKEN_SECRET_KEY: string;
        REFRESH_TOKEN_SECRET_KEY_EXPIRES_IN: string;
        JWT_ISSUER: string;
      };
    }>,
  ) {
    this.REFRESH_TOKEN_SECRET_KEY = this.config.get<string>(
      'auth.REFRESH_TOKEN_SECRET_KEY',
      {
        infer: true,
      },
    );
    this.REFRESH_TOKEN_SECRET_KEY_EXPIRES_IN = this.config.get<string>(
      'auth.REFRESH_TOKEN_SECRET_KEY_EXPIRES_IN',
      {
        infer: true,
      },
    );
    this.JWT_ISSUER = this.config.get<string>('auth.JWT_ISSUER', {
      infer: true,
    });
  }

  async createRefreshToken(id: string) {
    return await this.jwtService.signAsync(
      { id },
      {
        secret: this.REFRESH_TOKEN_SECRET_KEY,
        expiresIn: this.REFRESH_TOKEN_SECRET_KEY_EXPIRES_IN,
        issuer: this.JWT_ISSUER,
      },
    );
  }

  async validateRefreshToken(token: string, res: Response) {
    this.emailService.sendEmail();

    if (!token) {
      throw new NotFoundException('Refresh token not found.');
    }

    const { exp }: Jwt = await this.jwtService.verifyAsync(token, {
      secret: this.REFRESH_TOKEN_SECRET_KEY,
      ignoreExpiration: true,
      issuer: this.JWT_ISSUER,
    });

    const user = await this.prismaClientService.user.findUnique({
      where: {
        refreshToken: token,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const accessToken = await this.signAccessToken(user.id);

    if (user.refreshTokenRevoked) {
      throw new UnauthorizedException('Token is suspended.');
    }

    if (Date.now() <= exp * 1000) {
      res.cookie(
        'accessToken',
        accessToken,
        cookieConfig(this.FIFTEEN_MINUTES),
      );

      return {
        id: user.id,
        message: 'Token refreshed.',
      };
    }

    throw new UnauthorizedException('Session has expired please login again.');
  }

  async signAccessToken(id: string) {
    return await this.jwtService.signAsync({ id });
  }

  async register(data: RegisterUserDTO) {
    const { email, password } = data;

    const hashedPassword = await hash(password, 10);

    return await this.prismaClientService.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  async setClientCookies(id: string, res: Response) {
    const SEVEN_DAYS = 6.048e8;

    const accessToken = await this.signAccessToken(id);
    const refreshToken = await this.createRefreshToken(id);

    const user = await this.prismaClientService.user.findUnique({
      where: { id },
    });

    if (user) {
      await this.prismaClientService.user.update({
        where: { id },
        data: { refreshToken },
      });
    }

    res.cookie('accessToken', accessToken, cookieConfig(this.FIFTEEN_MINUTES));
    res.cookie('refreshToken', refreshToken, cookieConfig(SEVEN_DAYS));
  }

  async clearTokens(res: Response) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
  }
}
