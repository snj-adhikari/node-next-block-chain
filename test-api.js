const http = require('http');

// Test health endpoint
const testHealthEndpoint = () => {
  const options = {
    hostname: 'localhost',
    port: 8001,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('✅ Health Check Response:', JSON.parse(data));
      testCreateBlockchain();
    });
  });

  req.on('error', (error) => {
    console.error('❌ Health Check Error:', error.message);
  });

  req.end();
};

// Test blockchain creation
const testCreateBlockchain = () => {
  const blockchainData = JSON.stringify({
    name: "TestCoin",
    symbol: "TEST",
    difficulty: 2,
    reward: 50,
    description: "A test blockchain for MVP verification",
    creator: "test-user"
  });

  const options = {
    hostname: 'localhost',
    port: 8001,
    path: '/api/blockchain/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(blockchainData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('✅ Blockchain Creation Response:', JSON.parse(data));
      testStatsEndpoint();
    });
  });

  req.on('error', (error) => {
    console.error('❌ Blockchain Creation Error:', error.message);
  });

  req.write(blockchainData);
  req.end();
};

// Test stats endpoint
const testStatsEndpoint = () => {
  const options = {
    hostname: 'localhost',
    port: 8001,
    path: '/api/stats',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('✅ Stats Response:', JSON.parse(data));
      console.log('\n🎉 Backend API Tests Completed Successfully!');
    });
  });

  req.on('error', (error) => {
    console.error('❌ Stats Error:', error.message);
  });

  req.end();
};

console.log('🚀 Testing Backend API Endpoints...\n');
testHealthEndpoint();
