import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { RegisterUserDTO } from './dto/register.dto';
export declare class AuthenticationService {
    private prismaClientService;
    private jwtService;
    private config;
    private refreshTokenSecretKey;
    private refreshTokenSecretKeyExpiresIn;
    private issuer;
    constructor(prismaClientService: PrismaClientService, jwtService: JwtService, config: ConfigService<{
        auth: {
            refreshTokenSecretKey: string;
            refreshTokenSecretKeyExpiresIn: string;
            issuer: string;
        };
    }>);
    createRefreshToken(id: number): Promise<string>;
    validateRefreshToken(token: string): Promise<any>;
    signAccessToken(id: number): Promise<string>;
    register(data: RegisterUserDTO): Promise<import(".prisma/client").User>;
}
