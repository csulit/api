import { HttpService } from '@nestjs/axios';
export declare class EmailService {
    private httpService;
    constructor(httpService: HttpService);
    sendEmail(data: {
        to: string;
        copy?: string;
        subject: string;
        body: string;
    }): Promise<string>;
}
