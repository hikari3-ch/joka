// Runs tests agains posts in the Hikari3 MongoDB, where everything should be
// {block: false}

const { filterContent } = require("../main.js");
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
  console.log("Running content filter tests...\n");
  
  let passed = 0;
  let failed = 0;
  let testNumber = 1;

  try {
    const posts = await getMessageFromPosts();
    
    for (const post of posts) {
      // Skip null/undefined messages
      if (!post) {
        console.log(`Message ${testNumber}: Skipping null/undefined message`);
        testNumber++;
        continue;
      }
      
      console.log(`Message ${testNumber}: Testing "${post.substring(0, 50)}${post.length > 50 ? '...' : ''}"`);
      
      try {
        const res = await filterContent(post);
        if (res.block === true) {
          console.log(`  ❌ FAIL: Expected post to pass, got block.`);
          failed += 1;
        } else {
          console.log(`  ✅ PASS: Expected pass, got pass`);
          passed += 1;
        }
      } catch (error) {
        console.log(`  🚨 ERROR: filterContent failed - ${error.message}`);
        failed += 1;
      }
      
      testNumber += 1;
    }
    
    // Display summary
    console.log(`\n=== TEST SUMMARY ===`);
    console.log(`Total tests: ${testNumber - 1}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success rate: ${((passed / (testNumber - 1)) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error("Failed to run tests:", error.message);
  }
}

runDBTests()