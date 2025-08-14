import { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';

// Import the backend app
const backendPath = path.join(process.cwd(), 'backend', 'src', 'app');
let app: any;

// Dynamic import to avoid build issues
const getApp = async () => {
  if (!app) {
    try {
      const appModule = await import(backendPath);
      app = appModule.default || appModule.app;
    } catch (error) {
      console.error('Error loading backend app:', error);
      // Fallback simple handler
      return null;
    }
  }
  return app;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const app = await getApp();
    
    if (!app) {
      // Simple fallback API responses
      const { method, url } = req;
      
      if (url === '/api/health') {
        return res.status(200).json({ 
          status: 'healthy', 
          timestamp: new Date().toISOString(),
          message: 'Blockchain Generator API is running'
        });
      }
      
      if (url?.startsWith('/api/blockchains') && method === 'GET') {
        const fs = await import('fs');
        const path = await import('path');
        
        try {
          const blockchainsPath = path.join(process.cwd(), 'backend', 'data', 'blockchains.json');
          const data = fs.readFileSync(blockchainsPath, 'utf8');
          const blockchains = JSON.parse(data);
          return res.status(200).json(blockchains);
        } catch (error) {
          console.error('Error reading blockchains:', error);
          return res.status(500).json({ error: 'Failed to load blockchains' });
        }
      }
      
      if (url?.startsWith('/api/blockchains') && method === 'POST') {
        try {
          const blockchain = req.body;
          
          // Basic validation
          if (!blockchain.name || !blockchain.symbol) {
            return res.status(400).json({ error: 'Name and symbol are required' });
          }
          
          // Add timestamp and ID
          const newBlockchain = {
            ...blockchain,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
          };
          
          // Save to file
          const fs = await import('fs');
          const path = await import('path');
          
          const blockchainsPath = path.join(process.cwd(), 'backend', 'data', 'blockchains.json');
          let blockchains: any[] = [];
          
          try {
            const data = fs.readFileSync(blockchainsPath, 'utf8');
            blockchains = JSON.parse(data);
          } catch (error) {
            // File might not exist, start with empty array
            blockchains = [];
          }
          
          blockchains.push(newBlockchain);
          fs.writeFileSync(blockchainsPath, JSON.stringify(blockchains, null, 2));
          
          return res.status(201).json(newBlockchain);
        } catch (error) {
          console.error('Error creating blockchain:', error);
          return res.status(500).json({ error: 'Failed to create blockchain' });
        }
      }
      
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // If we have the Express app, use it
    return app(req, res);
    
  } catch (error) {
    console.error('API Handler Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}
