const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Configuration...');
console.log('============================');

// Check next.config.js
console.log('\n1. Checking next.config.js...');
try {
  const nextConfig = fs.readFileSync(path.join(__dirname, 'client/next.config.js'), 'utf8');
  if (nextConfig.includes('localhost:5000')) {
    console.log('❌ Found localhost:5000 in next.config.js');
  } else {
    console.log('✅ next.config.js looks good');
  }
} catch (error) {
  console.log('❌ Error reading next.config.js:', error.message);
}

// Check API instance
console.log('\n2. Checking API instance configuration...');
try {
  const apiInstance = fs.readFileSync(path.join(__dirname, 'client/src/lib/api/instance.ts'), 'utf8');
  if (apiInstance.includes('localhost:5000')) {
    console.log('❌ Found localhost:5000 in API instance');
  } else {
    console.log('✅ API instance looks good');
  }
} catch (error) {
  console.log('❌ Error reading API instance:', error.message);
}

// Check docker-compose.yml
console.log('\n3. Checking docker-compose.yml...');
try {
  const dockerCompose = fs.readFileSync(path.join(__dirname, 'docker-compose.yml'), 'utf8');
  if (dockerCompose.includes('localhost:5000')) {
    console.log('❌ Found localhost:5000 in docker-compose.yml');
  } else {
    console.log('✅ docker-compose.yml looks good');
  }
  
  if (dockerCompose.includes('13.203.101.91:5001')) {
    console.log('✅ Correct IP and port found in docker-compose.yml');
  } else {
    console.log('❌ Correct IP and port not found in docker-compose.yml');
  }
} catch (error) {
  console.log('❌ Error reading docker-compose.yml:', error.message);
}

// Check CORS configuration
console.log('\n4. Checking CORS configuration...');
try {
  const corsConfig = fs.readFileSync(path.join(__dirname, 'server/src/config/cors.js'), 'utf8');
  if (corsConfig.includes('true; // Allow all origins')) {
    console.log('✅ CORS configured to allow all origins');
  } else {
    console.log('❌ CORS not configured to allow all origins');
  }
} catch (error) {
  console.log('❌ Error reading CORS config:', error.message);
}

console.log('\n📋 Summary:');
console.log('- Frontend should be accessible at: http://13.203.101.91:3000');
console.log('- Backend should be accessible at: http://13.203.101.91:5001');
console.log('- API calls should go to: http://13.203.101.91:5001/api');
console.log('\n🔧 If issues persist, run: ./fix-cors-issue.sh');
