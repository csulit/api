import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RateLimiterGuard, RateLimiterModule } from 'nestjs-rate-limiter';
import { rateLimitExceededResponse } from 'src/common/serializer/response/rate-limit.response';
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
      points: 100,
      duration: 300,
      customResponseSchema: () => rateLimitExceededResponse(),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { accessTokenSecretKey, accessTokenSecretKeyExpiresIn, issuer } =
          configService.get<{
            accessTokenSecretKey: string;
            accessTokenSecretKeyExpiresIn: string;
            issuer: string;
          }>('auth');

        return {
          secret: accessTokenSecretKey,
          signOptions: {
            expiresIn: accessTokenSecretKeyExpiresIn,
          },
          issuer,
        };
      },
    }),
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
