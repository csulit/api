import { Strategy } from 'passport-local';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
declare const LocalStrategyService_base: new (...args: any[]) => Strategy;
export declare class LocalStrategyService extends LocalStrategyService_base {
    private prismaClientService;
    constructor(prismaClientService: PrismaClientService);
    validate(email: string, password: string): Promise<{
        id: string;
        email: string;
        isLocked: boolean;
        password: string;
    }>;
}
export {};
