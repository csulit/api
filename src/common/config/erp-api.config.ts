import { registerAs } from '@nestjs/config';

export default registerAs('erp-api', () => ({
  ERP_API_BASE_URL: process.env.ERP_API_BASE_URL,
}));
