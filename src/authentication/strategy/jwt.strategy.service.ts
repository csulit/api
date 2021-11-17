import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { Jwt } from '../interface/jwt.interface';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService<{
      auth: { ACCESS_TOKEN_SECRET_KEY: string };
    }>,
    private prismaClientService: PrismaClientService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req?.cookies?.accessToken) {
            return req.cookies.accessToken;
          }
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.ACCESS_TOKEN_SECRET_KEY', {
        infer: true,
      }),
    });
  }

  async validate(payload: Jwt) {
    return await this.prismaClientService.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        isLocked: true,
        passwordChangedAt: true,
        crmAccess: true,
        isClientAccess: true,
      },
    });
  }
}
