import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  partner?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token', data: null });
      }

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      // Attach decoded data to request
      req.partner = decoded;

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed', data: null });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token', data: null });
  }
};
