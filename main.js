const fs = require('fs');
const process = require('process');
const ollama = require('ollama').default;

const prompt = fs.readFileSync('prompt.md', 'utf8');
async function filterContent(arg0) {
  // Create the .dev file to enable debugging logs
  if (fs.existsSync('.dev')) {
    console.log(prompt);
    console.log('----------------------------');
  }

  const response = await ollama.chat({
    model: 'llama3.2:3b',
    messages: [{ role: 'user', content: prompt.replace('CONTENTPLACEHOLDER:p', arg0) }],
    format: {
      type: 'object',
      properties: {
        block: {
          type: 'boolean',
        },
      },
      required: ['block'],
    },
  });

  // Check to see if the content is
  // properly formatted and re-try if not
  try {
    const res = JSON.parse(response.message.content);
    if (fs.existsSync('.dev')) console.log(res.block);
    return res.block;
  } catch {
    throw new Error('Failed to parse response even with structured output.');
  }
}

if (require.main === module) {
  if (process.argv.length < 3) {
    console.log('Missing content.');
    process.exit(2);
  } else if (process.argv.length > 3) {
    console.log('Too many args.');
    process.exit(2);
  } else {
    filterContent(process.argv[2]);
  }
}

module.exports = { filterContent };
