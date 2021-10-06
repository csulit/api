import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  ERP_BASE_URL: process.env.ERP_BASE_URL,
  ERP_EMAIL_URL: process.env.ERP_EMAIL_URL,
}));
