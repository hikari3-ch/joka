// Runs tests agains posts in the Hikari3 MongoDB, where everything should be
// {block: false}

const { filterContent } = require('../main.js');
const { MongoClient } = require('mongodb');

async function getMessageFromPosts() {
  const client = new MongoClient('mongodb://localhost:27017');

  try {
    await client.connect();
    const db = client.db('lynxchan');
    const collection = db.collection('posts');

    // Query to get only the message field from all posts
    const posts = await collection.find({}, { projection: { message: 1, _id: 0 } }).toArray();

    return posts.map((m) => m.message);
  } finally {
    await client.close();
  }
}

async function runDBTests() {
  console.log('Running database content filter tests...\n');

  let passed = 0;
  let failed = 0;
  let testNumber = 1;

  try {
    const posts = await getMessageFromPosts();
    
    for (const post of posts) {
      // Skip null/undefined messages
      if (!post) {
        console.log(`Test ${testNumber}: Skipping null/undefined message`);
        testNumber++;
        continue;
      }
      
      console.log(`Test ${testNumber}: Testing "${post.substring(0, 50)}${post.length > 50 ? '...' : ''}"`);
      
      try {
        const shouldBlock = await filterContent(post);
        
        if (shouldBlock === false) {
          console.log(`  ✅ PASS: Expected false, got ${shouldBlock}`);
          passed++;
        } else {
          console.log(`  ❌ FAIL: Expected false, got ${shouldBlock}`);
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
    
  } catch (error) {
    console.error('Failed to run database tests:', error.message);
    return { passed: 0, failed: 1, total: 1 };
  }
}

if (require.main === module) {
  runDBTests().catch(console.error);
}

module.exports = { runDBTests, getMessageFromPosts };