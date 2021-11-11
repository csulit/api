import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RateLimiterGuard, RateLimiterModule } from 'nestjs-rate-limiter';
import { rateLimitExceededResponse } from 'src/common/serializer/response/rate-limit.response';
import { EmailModule } from 'src/email/email.module';
import { PrismaClientModule } from 'src/prisma-client/prisma-client.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtStrategyService } from './strategy/jwt.strategy.service';
import { LocalStrategyService } from './strategy/local-auth.strategy.service';

@Module({
  imports: [
    PrismaClientModule,
    RateLimiterModule.register({
      keyPrefix: 'global-auth',
      points: 350,
      duration: 100,
      customResponseSchema: () => rateLimitExceededResponse(),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const {
          ACCESS_TOKEN_SECRET_KEY,
          ACCESS_TOKEN_SECRET_KEY_EXPIRES_IN,
          JWT_ISSUER,
        } = configService.get<{
          ACCESS_TOKEN_SECRET_KEY: string;
          ACCESS_TOKEN_SECRET_KEY_EXPIRES_IN: string;
          JWT_ISSUER: string;
        }>('auth');

        return {
          secret: ACCESS_TOKEN_SECRET_KEY,
          signOptions: {
            expiresIn: ACCESS_TOKEN_SECRET_KEY_EXPIRES_IN,
          },
          JWT_ISSUER,
        };
      },
    }),
    EmailModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RateLimiterGuard,
    },
    AuthenticationService,
    LocalStrategyService,
    JwtStrategyService,
  ],
})
export class AuthenticationModule {}
