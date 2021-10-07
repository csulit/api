import { Request, Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { EmailDTO } from './dto/email.dto';
import { OtpAuthDTO } from './dto/otp-auth.dto';
import { RegisterUserDTO } from './dto/register.dto';
export declare class AuthenticationController {
    private readonly authenticationService;
    constructor(authenticationService: AuthenticationService);
    login(req: Request, res: Response): Promise<{
        id: string;
        email: string;
    }>;
    register(data: RegisterUserDTO, res: Response): Promise<{
        id: string;
        email: string;
    }>;
    sendOtpCode(data: EmailDTO): Promise<any>;
    otpAuth(data: OtpAuthDTO, res: Response): Promise<{
        id: string;
        email: string;
        profile: {
            firstName: string;
            lastName: string;
            address: string;
            phoneNumber: string;
            organization: string;
        };
    }>;
    refreshToken(req: Request, res: Response): Promise<{
        id: string;
        message: string;
    }>;
    logout(res: Response): Promise<{
        message: string;
    }>;
}
