import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY,
  ACCESS_TOKEN_SECRET_KEY_EXPIRES_IN:
    process.env.ACCESS_TOKEN_SECRET_KEY_EXPIRES_IN,
  REFRESH_TOKEN_SECRET_KEY_EXPIRES_IN:
    process.env.REFRESH_TOKEN_SECRET_KEY_EXPIRES_IN,
  JWT_ISSUER: process.env.JWT_ISSUER,
}));
