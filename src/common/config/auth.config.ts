import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
  refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
  accessTokenSecretKeyExpiresIn: process.env.ACCESS_TOKEN_SECRET_KEY_EXPIRES_IN,
  refreshTokenSecretKeyExpiresIn:
    process.env.REFRESH_TOKEN_SECRET_KEY_EXPIRES_IN,
  issuer: process.env.JWT_ISSUER,
}));
