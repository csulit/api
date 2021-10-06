import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private httpService: HttpService) {}

  async sendEmail() {
    this.httpService.post('/api/Email/sendemailbackup', {
      to: 'chrisgelosulit@gmail.com',
      copy: 'christian.sulit@kmc.solutions',
      subject: 'Test email',
      body: 'Yow!',
    });

    return null;
  }
}
