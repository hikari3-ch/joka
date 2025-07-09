const { testCases } = require('./static_cases.test.js');
const { filterContent } = require('../main.js');

async function runTests() {
  console.log('Running content filter tests...\n');

  let passed = 0;
  let failed = 0;
  let testNumber = 1;

  for (const [content, shouldBlock] of testCases) {
    console.log(`Test ${testNumber}: Testing "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`);

    try {
      const actualBlock = await filterContent(content);

      if (actualBlock === shouldBlock) {
        console.log(`  ✅ PASS: Expected ${shouldBlock}, got ${actualBlock}`);
        passed++;
      } else {
        console.log(`  ❌ FAIL: Expected ${shouldBlock}, got ${actualBlock}`);
        failed++;
      }
    } catch (error) {
      console.log(`  ❌ ERROR: ${error.message}`);
      failed++;
    }

    testNumber++;
    console.log(); // Empty line for readability
  }

  console.log(`\nTest Results:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${testNumber - 1}`);
  console.log(`🎯 Success Rate: ${((passed / (testNumber - 1)) * 100).toFixed(1)}%`);

  return { passed, failed, total: testNumber - 1 };
}

if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };
