import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EmailService {
  constructor(private httpService: HttpService) {}

  async sendEmail(data: {
    to: string;
    copy?: string;
    subject: string;
    body: string;
  }) {
    const email = this.httpService.post('/api/Email/sendemailbackup', data);

    const result = await firstValueFrom(email);

    return result.statusText;
  }
}
