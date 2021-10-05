import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { RegisterUserDTO } from './dto/register.dto';
export declare class AuthenticationService {
    private prismaClientService;
    private jwtService;
    private config;
    private refreshTokenSecretKey;
    private refreshTokenSecretKeyExpiresIn;
    private issuer;
    private fifteenMinutes;
    constructor(prismaClientService: PrismaClientService, jwtService: JwtService, config: ConfigService<{
        auth: {
            refreshTokenSecretKey: string;
            refreshTokenSecretKeyExpiresIn: string;
            issuer: string;
        };
    }>);
    createRefreshToken(id: string): Promise<string>;
    validateRefreshToken(token: string, res: Response): Promise<{
        id: string;
        message: string;
    }>;
    signAccessToken(id: string): Promise<string>;
    register(data: RegisterUserDTO): Promise<{
        id: string;
        email: string;
    }>;
    setClientCookies(id: string, res: Response): Promise<void>;
}
