import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index';
import './models/index'; // Register all models

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const body = req.body && Object.keys(req.body).length > 0
    ? JSON.stringify(req.body)
    : '';
  const shortBody = body.length > 100 ? body.substring(0, 100) + '...' : body;
  console.log(`${req.method} ${req.originalUrl} ${shortBody}`);
  next();
});

// Routes
app.use('/api', apiRoutes);

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

export default app;
