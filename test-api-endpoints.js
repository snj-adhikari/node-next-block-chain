#!/usr/bin/env node
// Test script for blockchain API endpoints

const http = require('http');

async function testEndpoint(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: parsed,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: responseData,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('🚀 Testing Blockchain API Endpoints...\n');

  // Test 1: Health Check
  console.log('1️⃣ Testing Health Endpoint...');
  try {
    const health = await testEndpoint('/api/health');
    console.log('✅ Health Status:', health.status);
    console.log('📄 Response:', health.data);
  } catch (error) {
    console.log('❌ Health Error:', error.message);
  }

  // Test 2: Stats
  console.log('\n2️⃣ Testing Stats Endpoint...');
  try {
    const stats = await testEndpoint('/api/stats');
    console.log('✅ Stats Status:', stats.status);
    console.log('📊 Stats:', stats.data);
  } catch (error) {
    console.log('❌ Stats Error:', error.message);
  }

  // Test 3: Get Blockchains
  console.log('\n3️⃣ Testing Get Blockchains...');
  try {
    const blockchains = await testEndpoint('/api/blockchains');
    console.log('✅ Blockchains Status:', blockchains.status);
    console.log('📦 Blockchains:', blockchains.data);
  } catch (error) {
    console.log('❌ Blockchains Error:', error.message);
  }

  // Test 4: Create Blockchain
  console.log('\n4️⃣ Testing Create Blockchain...');
  try {
    const newBlockchain = {
      name: 'TestCoin',
      description: 'A test blockchain created by Clark',
      difficulty: 2,
      miningReward: 50,
      tags: ['test', 'demo']
    };

    const createResult = await testEndpoint('/api/blockchains', 'POST', newBlockchain);
    console.log('✅ Create Status:', createResult.status);
    console.log('🎉 Created Blockchain:', createResult.data);

    // If creation was successful, test mining
    if (createResult.status === 201 && createResult.data.id) {
      console.log('\n5️⃣ Testing Mining...');
      const mineResult = await testEndpoint(`/api/blockchains/${createResult.data.id}/mine`, 'POST');
      console.log('✅ Mine Status:', mineResult.status);
      console.log('⛏️ Mining Result:', mineResult.data);
    }

  } catch (error) {
    console.log('❌ Create Error:', error.message);
  }

  console.log('\n🎯 API Testing Complete!');
}

runTests().catch(console.error);
