const axios = require('axios');

async function testCORS() {
  const backendUrl = 'http://13.203.101.91:5001';
  
  try {
    console.log('🧪 Testing CORS configuration...');
    
    // Test OPTIONS preflight request
    console.log('1. Testing OPTIONS preflight request...');
    const optionsResponse = await axios.options(`${backendUrl}/api/auth/login`, {
      headers: {
        'Origin': 'http://13.203.101.91:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    
    console.log('✅ OPTIONS request successful');
    console.log('CORS Headers:', {
      'Access-Control-Allow-Origin': optionsResponse.headers['access-control-allow-origin'],
      'Access-Control-Allow-Methods': optionsResponse.headers['access-control-allow-methods'],
      'Access-Control-Allow-Headers': optionsResponse.headers['access-control-allow-headers']
    });
    
    // Test health endpoint
    console.log('\n2. Testing health endpoint...');
    const healthResponse = await axios.get(`${backendUrl}/health`);
    console.log('✅ Health check successful:', healthResponse.data);
    
    console.log('\n🎉 CORS test completed successfully!');
    
  } catch (error) {
    console.error('❌ CORS test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
  }
}

testCORS();
