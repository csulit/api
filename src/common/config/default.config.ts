import { registerAs } from '@nestjs/config';

export default registerAs('default', () => ({
  ERP_BASE_URL: process.env.ERP_BASE_URL,
}));
