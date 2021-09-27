import { Strategy } from 'passport-local';
declare const LocalStrategyService_base: new (...args: any[]) => Strategy;
export declare class LocalStrategyService extends LocalStrategyService_base {
    constructor();
    validate(email: string, password: string): Promise<{
        email: string;
    }>;
}
export {};
