import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { EmailService } from 'src/email/email.service';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { RegisterUserDTO } from './dto/register.dto';
export declare class AuthenticationService {
    private emailService;
    private prismaClientService;
    private jwtService;
    private config;
    private REFRESH_TOKEN_SECRET_KEY;
    private REFRESH_TOKEN_SECRET_KEY_EXPIRES_IN;
    private JWT_ISSUER;
    private FIFTEEN_MINUTES;
    constructor(emailService: EmailService, prismaClientService: PrismaClientService, jwtService: JwtService, config: ConfigService<{
        auth: {
            REFRESH_TOKEN_SECRET_KEY: string;
            REFRESH_TOKEN_SECRET_KEY_EXPIRES_IN: string;
            JWT_ISSUER: string;
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
    private generateRandomOtp;
    private createOtpCode;
    sendOtpCode(email: string): Promise<any>;
    otpAuth(data: {
        email: string;
        otp: number;
    }): Promise<{
        id: string;
        email: string;
        profile: {
            firstName: string;
            lastName: string;
            phoneNumber: string;
            organization: string;
            address: string;
        };
    }>;
    setClientCookies(id: string, res: Response): Promise<void>;
    clearTokens(res: Response): Promise<void>;
}
