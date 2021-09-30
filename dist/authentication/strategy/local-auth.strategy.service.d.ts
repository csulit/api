import { Strategy } from 'passport-local';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
declare const LocalStrategyService_base: new (...args: any[]) => Strategy;
export declare class LocalStrategyService extends LocalStrategyService_base {
    private prismaClientService;
    constructor(prismaClientService: PrismaClientService);
    validate(email: string, password: string): Promise<{
        email: string;
        id: string;
        password: string;
        isLocked: boolean;
    }>;
}
export {};
