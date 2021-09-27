import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
export declare class AuthenticationService {
    private jwtService;
    private config;
    private refreshTokenKey;
    constructor(jwtService: JwtService, config: ConfigService<{
        auth: {
            refreshTokenKey: string;
        };
    }>);
    createJwtToken(id: number): Promise<string>;
    signJwt(id: number): Promise<string>;
}
