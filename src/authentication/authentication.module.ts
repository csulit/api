import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RateLimiterGuard, RateLimiterModule } from 'nestjs-rate-limiter';
import { rateLimitExceeded } from 'src/common/serializer/response/rate-limit.response';
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
      customResponseSchema: () => rateLimitExceeded(),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.accessTokenSecretKey'),
        signOptions: {
          expiresIn: configService.get<string>('auth.accessTokenExpires'),
        },
      }),
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
