import { registerAs } from '@nestjs/config';

export default registerAs('erp-auth', () => ({
  ERP_AUTH_BASE_URL: process.env.ERP_AUTH_BASE_URL,
}));
