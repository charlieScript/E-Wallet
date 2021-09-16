import jwt, { JwtPayload } from 'jsonwebtoken';

export const signPayload = (payload: { [key: string]: any; }): string => {
  return jwt.sign(payload, 'chigozie1999', { expiresIn: '10h' });
};

export const verifyPayload = (payload: string): string | JwtPayload => {
  return jwt.verify(payload, 'chigozie1999');
};
