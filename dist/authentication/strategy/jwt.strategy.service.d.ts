import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { Jwt } from '../interface/jwt.interface';
declare const JwtStrategyService_base: new (...args: any[]) => Strategy;
export declare class JwtStrategyService extends JwtStrategyService_base {
    readonly configService: ConfigService<{
        auth: {
            accessTokenSecretKey: string;
        };
    }>;
    private prismaClientService;
    constructor(configService: ConfigService<{
        auth: {
            accessTokenSecretKey: string;
        };
    }>, prismaClientService: PrismaClientService);
    validate(payload: Jwt): Promise<{
        email: string;
        id: string;
        isLocked: boolean;
        passwordChangedAt: Date;
    }>;
}
export {};
