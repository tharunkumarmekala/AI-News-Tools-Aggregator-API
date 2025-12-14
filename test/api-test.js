/**
 * API Test Script for AI News Aggregator
 * Run with: node test/api-test.js
 */

const BASE_URL = 'http://localhost:8787'; // Change to your worker URL for production testing
const ENDPOINTS = [
  '/',
  '/latest',
  '/trending',
  '/toolify',
  '/all',
  '/status'
];

async function testEndpoint(endpoint) {
  try {
    console.log(`\n🔍 Testing: ${endpoint}`);
    
    const startTime = Date.now();
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const endTime = Date.now();
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Response Time: ${endTime - startTime}ms`);
    
    if (response.ok) {
      const data = await response.json();
      
      if (endpoint === '/') {
        console.log('📚 API Documentation loaded successfully');
        console.log(`API Name: ${data.api_name}`);
        console.log(`Endpoints: ${Object.keys(data.endpoints).join(', ')}`);
      } else if (endpoint === '/all') {
        console.log(`📊 Sources: ${Object.keys(data.sources).join(', ')}`);
        console.log(`Total Items: ${data.summary?.total_items || 'N/A'}`);
        
        // Print counts per source
        for (const [sourceName, sourceData] of Object.entries(data.sources)) {
          console.log(`  ${sourceName}: ${sourceData.count} items`);
        }
      } else {
        const itemCount = data.count || data.length || 0;
        console.log(`📦 Items: ${itemCount}`);
        
        // Show first item if available
        const items = data.data || data;
        if (items && items.length > 0) {
          const firstItem = items[0];
          console.log(`First Item Preview:`);
          console.log(`  Title/Name: ${firstItem.title || firstItem.name || 'N/A'}`);
          console.log(`  Description: ${(firstItem.description || '').substring(0, 60)}...`);
          
          if (firstItem.score) {
            console.log(`  Score: ${firstItem.score}`);
          }
          if (firstItem.time_ago) {
            console.log(`  Time: ${firstItem.time_ago}`);
          }
        }
      }
      
      return { success: true, endpoint, status: response.status, time: endTime - startTime };
    } else {
      const errorText = await response.text();
      console.log(`❌ Error: ${errorText.substring(0, 100)}`);
      return { success: false, endpoint, status: response.status, error: errorText };
    }
  } catch (error) {
    console.log(`❌ Exception: ${error.message}`);
    return { success: false, endpoint, error: error.message };
  }
}

async function runLoadTest() {
  console.log('🚀 Running API Load Test...');
  console.log(`Base URL: ${BASE_URL}`);
  console.log('=' .repeat(50));
  
  const results = [];
  
  // Test each endpoint
  for (const endpoint of ENDPOINTS) {
    const result = await testEndpoint(endpoint);
    results.push(result);
  }
  
  // Print summary
  console.log('\n' + '=' .repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(50));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);
  
  if (successful.length > 0) {
    const avgTime = successful.reduce((sum, r) => sum + (r.time || 0), 0) / successful.length;
    console.log(`⏱️  Average Response Time: ${avgTime.toFixed(2)}ms`);
  }
  
  if (failed.length > 0) {
    console.log('\nFailed Endpoints:');
    failed.forEach(f => {
      console.log(`  ${f.endpoint}: ${f.error || `Status ${f.status}`}`);
    });
  }
  
  // Check if worker is responsive
  console.log('\n🎯 Health Check:');
  const healthEndpoint = results.find(r => r.endpoint === '/status');
  if (healthEndpoint?.success) {
    console.log('✅ Worker is healthy and responding');
  } else {
    console.log('⚠️  Worker health check failed');
  }
}

async function testSpecificScenario() {
  console.log('\n' + '=' .repeat(50));
  console.log('🔧 Testing Specific Scenarios');
  console.log('=' .repeat(50));
  
  // Test 404 endpoint
  console.log('\nTesting non-existent endpoint:');
  await testEndpoint('/nonexistent');
  
  // Test with query parameters (should be ignored)
  console.log('\nTesting endpoint with query params:');
  await testEndpoint('/toolify?limit=5&format=json');
  
  // Test CORS headers
  console.log('\nTesting CORS headers:');
  try {
    const response = await fetch(`${BASE_URL}/latest`);
    const corsHeader = response.headers.get('Access-Control-Allow-Origin');
    console.log(`CORS Header: ${corsHeader || 'Not found'}`);
    console.log(corsHeader === '*' ? '✅ CORS properly configured' : '⚠️  CORS may need configuration');
  } catch (error) {
    console.log(`❌ CORS test failed: ${error.message}`);
  }
}

async function testDataIntegrity() {
  console.log('\n' + '=' .repeat(50));
  console.log('🔍 Testing Data Integrity');
  console.log('=' .repeat(50));
  
  try {
    const response = await fetch(`${BASE_URL}/toolify`);
    if (response.ok) {
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        const items = data.data;
        
        // Check for required fields
        const validItems = items.filter(item => 
          item.title && 
          item.description && 
          item.title.length > 0 && 
          item.description.length > 0
        );
        
        console.log(`Total Items: ${items.length}`);
        console.log(`Valid Items: ${validItems.length}`);
        console.log(`Data Quality: ${((validItems.length / items.length) * 100).toFixed(1)}%`);
        
        // Check for duplicates
        const titles = items.map(item => item.title?.toLowerCase().trim());
        const uniqueTitles = [...new Set(titles)];
        console.log(`Duplicate Titles: ${items.length - uniqueTitles.length}`);
        
        // Sample data check
        if (validItems.length > 0) {
          console.log('\nSample Data Check:');
          const sample = validItems[0];
          console.log(`Title length: ${sample.title.length} chars`);
          console.log(`Description length: ${sample.description.length} chars`);
          console.log(`Has source: ${!!sample.source}`);
        }
      }
    }
  } catch (error) {
    console.log(`❌ Data integrity test failed: ${error.message}`);
  }
}

async function runAllTests() {
  console.log('🧪 AI News Aggregator - API Test Suite');
  console.log('=' .repeat(50));
  
  await runLoadTest();
  await testSpecificScenario();
  await testDataIntegrity();
  
  console.log('\n' + '=' .repeat(50));
  console.log('🎉 All tests completed!');
  console.log('=' .repeat(50));
  
  // Instructions for different test modes
  console.log('\n📝 Test Modes:');
  console.log('1. Local Testing: Set BASE_URL = "http://localhost:8787"');
  console.log('2. Production Testing: Set BASE_URL = "https://your-worker.workers.dev"');
  console.log('3. Custom Testing: Modify the test functions as needed');
}

// Run tests if this file is executed directly
if (require.main === module) {
  // Check if a custom URL was provided as argument
  if (process.argv[2]) {
    const customUrl = process.argv[2];
    console.log(`Using custom URL: ${customUrl}`);
    BASE_URL = customUrl;
  }
  
  runAllTests().catch(console.error);
}

module.exports = {
  testEndpoint,
  runLoadTest,
  testSpecificScenario,
  testDataIntegrity,
  runAllTests
};
