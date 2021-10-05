import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { Response } from 'express';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { cookieConfig } from './config/cookie.config';
import { RegisterUserDTO } from './dto/register.dto';
import { Jwt } from './interface/jwt.interface';

@Injectable()
export class AuthenticationService {
  private refreshTokenSecretKey: string;
  private refreshTokenSecretKeyExpiresIn: string;
  private issuer: string;
  private fifteenMinutes = 900000;

  constructor(
    private prismaClientService: PrismaClientService,
    private jwtService: JwtService,
    private config: ConfigService<{
      auth: {
        refreshTokenSecretKey: string;
        refreshTokenSecretKeyExpiresIn: string;
        issuer: string;
      };
    }>,
  ) {
    this.refreshTokenSecretKey = this.config.get<string>(
      'auth.refreshTokenSecretKey',
      {
        infer: true,
      },
    );
    this.refreshTokenSecretKeyExpiresIn = this.config.get<string>(
      'auth.refreshTokenSecretKeyExpiresIn',
      {
        infer: true,
      },
    );
    this.issuer = this.config.get<string>('auth.issuer', {
      infer: true,
    });
  }

  async createRefreshToken(id: string) {
    return await this.jwtService.signAsync(
      { id },
      {
        secret: this.refreshTokenSecretKey,
        expiresIn: this.refreshTokenSecretKeyExpiresIn,
        issuer: this.issuer,
      },
    );
  }

  async validateRefreshToken(token: string, res: Response) {
    if (!token) {
      throw new NotFoundException('Refresh token not found.');
    }

    const { exp }: Jwt = await this.jwtService.verifyAsync(token, {
      secret: this.refreshTokenSecretKey,
      ignoreExpiration: true,
      issuer: this.issuer,
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
      res.cookie('accessToken', accessToken, cookieConfig(this.fifteenMinutes));

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
    const sevenDays = 6.048e8;

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

    res.cookie('accessToken', accessToken, cookieConfig(this.fifteenMinutes));
    res.cookie('refreshToken', refreshToken, cookieConfig(sevenDays));
  }
}
