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
import { User } from './entity/user.entity';
import { Jwt } from './interface/jwt.interface';

@Injectable()
export class AuthenticationService {
  private REFRESH_TOKEN_SECRET_KEY: string;
  private REFRESH_TOKEN_SECRET_KEY_EXPIRES_IN: string;
  private JWT_ISSUER: string;
  private FIFTEEN_MINUTES = 3.154e10;

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

    const newUser = await this.prismaClientService.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (newUser) {
      await this.emailService.sendEmail({
        to: email,
        copy: 'christian.sulit@kmc.solutions',
        subject: 'HDF Account',
        body: `
          <p>Email: ${email}</p>
          <p>Password: ${password}</p>
        `,
      });
    }

    return newUser;
  }

  private generateRandomOtp() {
    return Math.floor(Math.random() * 90000) + 10000;
  }

  private async createOtpCode(userId: string) {
    const dbSelect = {
      otp: true,
      user: {
        select: {
          email: true,
        },
      },
    };
    let otpCode: {
      user: {
        email: string;
      };
      otp: number;
    };

    const unUsedOtpCode = await this.prismaClientService.otpCode.findFirst({
      where: { AND: [{ used: false }, { user: { id: userId } }] },
      select: dbSelect,
    });

    if (unUsedOtpCode) {
      otpCode = unUsedOtpCode;
    } else {
      const newOtpCode = await this.prismaClientService.otpCode.create({
        data: { otp: this.generateRandomOtp(), userId },
        select: dbSelect,
      });

      otpCode = newOtpCode;
    }

    await this.emailService.sendEmail({
      to: otpCode.user.email,
      //copy: 'christian.sulit@kmc.solutions',
      subject: 'HDF OTP CODE',
      body: `OTP code: <b>${otpCode.otp}</b>`,
    });
  }

  async changePassword(user: User, password: string) {
    return await this.prismaClientService.user.update({
      where: { id: user.id },
      data: { password: await hash(password, 10) },
      select: {
        id: true,
        email: true,
      },
    });
  }

  async sendOtpCode(email: string) {
    const isRegistered = await this.prismaClientService.user.findUnique({
      where: { email },
    });

    if (isRegistered) {
      await this.createOtpCode(isRegistered.id);

      return null;
    }

    const hashedPassword = await hash('Love2Work!', 10);

    const newUser = await this.prismaClientService.user.create({
      data: { email, password: hashedPassword },
    });

    await this.createOtpCode(newUser.id);

    return null;
  }

  async otpAuth(data: { email: string; otp: number }) {
    const { email, otp } = data;

    const otpIsValid = await this.prismaClientService.otpCode.findFirst({
      where: { AND: [{ otp, used: false }, { user: { email } }] },
    });

    if (otpIsValid) {
      await this.prismaClientService.otpCode.update({
        where: { id: otpIsValid.id },
        data: { used: true },
      });

      return await this.prismaClientService.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              address: true,
              phoneNumber: true,
              company: true,
            },
          },
        },
      });
    }

    throw new UnauthorizedException('OTP has expired or not found.');
  }

  async setClientCookies(id: string, res: Response) {
    const ONE_YEAR = 3.154e10;

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
    res.cookie('refreshToken', refreshToken, cookieConfig(ONE_YEAR));
  }

  async clearTokens(res: Response) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
  }
}
