import { Request, Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { RegisterUserDTO } from './dto/register.dto';
export declare class AuthenticationController {
    private readonly authenticationService;
    constructor(authenticationService: AuthenticationService);
    login(req: Request, res: Response): Promise<{
        id: number;
        email: string;
        isLocked: number;
    }>;
    register(data: RegisterUserDTO): Promise<import(".prisma/client").User>;
    refreshToken(): Promise<string>;
}
