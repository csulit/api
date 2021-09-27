import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { compare } from 'bcrypt';
import { Strategy } from 'passport-local';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';

@Injectable()
export class LocalStrategyService extends PassportStrategy(Strategy) {
  constructor(private prismaClientService: PrismaClientService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.prismaClientService.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        isLocked: true,
      },
    });

    if (user) {
      if (user.isLocked) {
        throw new UnauthorizedException('Your account is locked.');
      }

      if (await compare(password, user.password)) {
        return user;
      }
    }

    throw new UnauthorizedException('Invalid credentials.');
  }
}
