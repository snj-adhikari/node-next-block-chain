import { app } from './app';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// For Vercel serverless deployment
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
