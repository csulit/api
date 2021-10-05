import { Request, Response } from 'express';
import { AuthenticationService } from './authentication.service';
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
    refreshToken(req: Request, res: Response): Promise<{
        id: string;
        message: string;
    }>;
    logout(res: Response): {
        message: string;
    };
}
