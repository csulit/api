import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class AuthenticationService {
  private refreshTokenSecretKey: string;
  private refreshTokenSecretKeyExpiresIn: string;
  private issuer: string;

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

  async createRefreshToken(id: number) {
    return await this.jwtService.signAsync(
      { id },
      {
        secret: this.refreshTokenSecretKey,
        expiresIn: this.refreshTokenSecretKeyExpiresIn,
        issuer: this.issuer,
      },
    );
  }

  async validateRefreshToken(token: string) {
    const [refreshToken, error] = await this.jwtService.verifyAsync(token, {
      secret: this.refreshTokenSecretKey,
      ignoreExpiration: false,
      issuer: this.issuer,
    });

    if (error) {
      throw new UnauthorizedException(
        'Session has expired please login again.',
      );
    }

    return refreshToken;
  }

  async signAccessToken(id: number) {
    return await this.jwtService.signAsync({ id });
  }

  async register() {
    return await this.prismaClientService.user.create({
      data: {
        email: 'chrisgelosulit@gmail.com',
        password: await hash('Love2eat', 10),
      },
    });
  }
}
