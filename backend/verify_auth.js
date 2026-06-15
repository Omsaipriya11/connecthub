import axios from 'axios';
import { spawn } from 'child_process';
import path from 'path';

const serverPath = path.resolve('server.js');
console.log('Starting backend verification server at:', serverPath);

const server = spawn('node', [serverPath], {
  env: {
    ...process.env,
    PORT: '5555',
    MONGO_URI: 'mongodb://localhost:27017/connecthub_test',
    JWT_SECRET: 'testsecretforconnecthubvalidation',
    NODE_ENV: 'test'
  }
});

server.stdout.on('data', (data) => {
  console.log(`[Server Out]: ${data.toString().trim()}`);
});

server.stderr.on('data', (data) => {
  console.error(`[Server Err]: ${data.toString().trim()}`);
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  const client = axios.create({
    baseURL: 'http://localhost:5555/api',
    validateStatus: () => true
  });

  const testUser = {
    name: 'Testy Tester',
    username: 'tester_' + Math.random().toString(36).substring(7),
    email: 'tester_' + Math.random().toString(36).substring(7) + '@test.com',
    password: 'password123'
  };

  console.log('\n--- 1. Testing Registration ---');
  let res = await client.post('/auth/register', testUser);
  console.log('Status:', res.status);
  console.log('Body:', JSON.stringify(res.data, null, 2));
  
  if (res.status !== 201 || !res.data.token) {
    throw new Error('Registration failed');
  }
  const token = res.data.token;

  console.log('\n--- 2. Testing Duplicate Registration (Username) ---');
  res = await client.post('/auth/register', {
    ...testUser,
    email: 'different_' + testUser.email
  });
  console.log('Status:', res.status);
  console.log('Body:', JSON.stringify(res.data, null, 2));
  if (res.status !== 400) {
    throw new Error('Duplicate username validation failed');
  }

  console.log('\n--- 3. Testing Login ---');
  res = await client.post('/auth/login', {
    email: testUser.email,
    password: testUser.password
  });
  console.log('Status:', res.status);
  console.log('Body:', JSON.stringify(res.data, null, 2));
  if (res.status !== 200 || !res.data.token) {
    throw new Error('Login failed');
  }

  console.log('\n--- 4. Testing Get Profile (/me) ---');
  res = await client.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('Status:', res.status);
  console.log('Body:', JSON.stringify(res.data, null, 2));
  if (res.status !== 200 || res.data.data.username !== testUser.username) {
    throw new Error('Get profile (/me) failed');
  }
  if (res.data.data.followers === undefined || res.data.data.following === undefined) {
    throw new Error('Follower and following counts missing in /me profile');
  }

  console.log('\n--- 5. Testing Route Protection ---');
  res = await client.get('/auth/me');
  console.log('Status:', res.status);
  console.log('Body:', JSON.stringify(res.data, null, 2));
  if (res.status !== 401) {
    throw new Error('Route protection check failed');
  }

  console.log('\n🎉 ALL INTEGRATION TESTS COMPLETED SUCCESSFULLY!');
}

async function main() {
  try {
    // Wait for database connection and server binding
    await delay(3500);
    await runTests();
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    process.exitCode = 1;
  } finally {
    console.log('Stopping verification server...');
    server.kill();
  }
}

main();
