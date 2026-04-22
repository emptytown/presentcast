/**
 * Moshly Broadcast — Test Suite
 * 
 * Run with: npm test
 */

const assert = require('assert');
const http = require('http');
const fetch = require('node-fetch');

// Test suite
const tests = {
  /**
   * Test: Server is running on correct port
   */
  'Server listens on port 8080': async () => {
    const response = await fetch('http://localhost:8080/health');
    assert.strictEqual(response.status, 200);
    const data = await response.json();
    assert.strictEqual(data.status, 'ok');
  },

  /**
   * Test: /screenshot endpoint returns JPEG
   */
  'Screenshot endpoint returns valid JPEG': async () => {
    const response = await fetch('http://localhost:8080/screenshot');
    assert.strictEqual(response.status, 200);
    assert.ok(response.headers.get('content-type').includes('image/jpeg'));
    const buffer = await response.buffer();
    assert.ok(buffer.length > 0, 'Screenshot buffer should not be empty');
  },

  /**
   * Test: /info endpoint returns server info
   */
  'Info endpoint returns server metadata': async () => {
    const response = await fetch('http://localhost:8080/info');
    assert.strictEqual(response.status, 200);
    const data = await response.json();
    assert.ok(data.hostname);
    assert.ok(data.platform);
    assert.ok(data.timestamp);
  },

  /**
   * Test: CORS headers are present
   */
  'CORS headers are configured': async () => {
    const response = await fetch('http://localhost:8080/health');
    assert.ok(
      response.headers.get('access-control-allow-origin'),
      'CORS header should be present'
    );
  },

  /**
   * Test: Error handling for invalid routes
   */
  'Invalid routes return 404': async () => {
    const response = await fetch('http://localhost:8080/invalid-route');
    assert.strictEqual(response.status, 404);
  },

  /**
   * Test: Concurrent screenshot requests
   */
  'Handles concurrent requests': async () => {
    const requests = Array(5)
      .fill(null)
      .map(() => fetch('http://localhost:8080/screenshot'));
    
    const responses = await Promise.all(requests);
    responses.forEach(res => {
      assert.strictEqual(res.status, 200);
    });
  }
};

// Runner
const runTests = async () => {
  console.log(`
╔═══════════════════════════════════════╗
║  MOSHLY BROADCAST — Test Suite        ║
╚═══════════════════════════════════════╝
  `);

  let passed = 0;
  let failed = 0;
  const errors = [];

  for (const [name, test] of Object.entries(tests)) {
    try {
      await test();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}`);
      console.log(`   Error: ${error.message}`);
      failed++;
      errors.push({ name, error });
    }
  }

  console.log(`
╔═══════════════════════════════════════╗
║  Results                              ║
╚═══════════════════════════════════════╝

Passed: ${passed}
Failed: ${failed}
Total:  ${passed + failed}

${failed > 0 ? '⚠️  Some tests failed. Check above for details.' : '✅ All tests passed!'}
  `);

  process.exit(failed > 0 ? 1 : 0);
};

// Start server if not already running, then run tests
const startServerAndTest = async () => {
  // Wait a moment for server to boot
  await new Promise(r => setTimeout(r, 1000));
  
  try {
    await runTests();
  } catch (err) {
    console.error('Test runner error:', err);
    process.exit(1);
  }
};

startServerAndTest();
