import { CookieOptions } from 'express';

export const cookieConfig = (seconds: number): CookieOptions => {
  return {
    expires: new Date(Date.now() + seconds),
    sameSite: process.env.NODE_ENV === 'development' ? 'none' : 'strict',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development' ? false : true,
  };
};
