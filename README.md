<h1 align="center">Jōka</h1>
<p align="center">
  <img src="https://img.shields.io/github/commit-activity/m/hikari3-ch/joka?style=flat-square&color=eba0ac&label=Commit%20Activity">
  <img src="https://img.shields.io/github/contributors/hikari3-ch/joka?style=flat-square&color=fab387&label=Contributors">
  <img src="https://img.shields.io/github/issues/hikari3-ch/joka?style=flat-square&color=f9e2af&label=Issues">
  <img src="https://img.shields.io/badge/Code_Style-Prettier-pink?style=flat-square&color=a6e3a1" href="https://prettier.io/">
</p>

## What is Jōka?

Jōka (浄化) is an AI-powered content moderation system built for [hikari3.ch](https://hikari3.ch/). It is designed to detect and filter illegal or harmful material—such as unsolicited advertisements and child sexual abuse content before it appears on the site.

> [!IMPORTANT]  
> **HELP WANTED!!** Any messing around inside of the prompt to make the bot more accurate is gladly appreciated, as it is only around 90% accurate right now, meaning that false positives occur around 10% of the time.

## Prerequisites

- **Node.js** (v14 or higher)
- **Ollama** installed and running locally
- **llama3.2:3b model** downloaded in Ollama

### Installing Ollama

1. Install Ollama from [ollama.ai](https://ollama.ai/)
2. Pull the required model:
   ```bash
   ollama pull llama3.2:3b
   ```
3. Verify Ollama is running:
   ```bash
   systemctl start ollama.service
   ```

## Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hikari3-ch/joka
   cd joka
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Ensure required files exist:**
   - `prompt.md` - Contains the AI moderation prompt (already included)
   - Make sure Ollama is running with the `llama3.2:3b` model

## Usage

### Command Line Interface

Filter a single piece of content:

```bash
node main.js "Your content to filter here"
```

**Examples:**
```bash
# This should return true (blocked)
node main.js "Buy my product now! 50% off!"

# This should return false (allowed)
node main.js "Hello everyone, how are you today?"
```

### Programmatic Usage

```javascript
const { filterContent } = require('./main.js');

async function example() {
    const shouldBlock = await filterContent("Some content to check");
    console.log(shouldBlock); // true or false
}
```

### Testing

Run the test suite to verify the system is working correctly:

```bash
npm run test-static
```

This will run through all test cases in [`testing/static_cases.test.js`](testing/static_cases.test.js) and show:
- ✅ Passed tests
- ❌ Failed tests  
- 📊 Total tests run
- 🎯 Success rate percentage

## API Reference

### `filterContent(content, retryCount = 0)`

**Parameters:**
- `content` (string): The text content to analyze
- `retryCount` (number): Internal retry counter (default: 0) (DO NOT MODIFY THIS)

**Returns:**
- `Promise<boolean>`: `true` if content should be blocked, `false` if allowed

**Throws:**
- Error if maximum retries (3) exceeded due to invalid AI responses
- Error if Ollama connection fails

## Content Filtering Rules

The system blocks content that contains:

- **Spam/Promotional content**: Ads, discount codes, MLM schemes
- **Inappropriate content involving minors**: Any coded language or direct references
- **Illegal content**: Drug sales, hacking services, etc.

**Allowed content includes:**
- Normal conversations and discussions
- Adult content (between consenting adults)
- Polite imageboard promotions
- Personal item sales
- Food discussions (including actual cheese pizza)
- Anime/gaming discussions

## Contributing

Contributions are welcome! The main areas for improvement:

1. **Prompt Stuff**: Modify [`prompt.md`](prompt.md) to improve accuracy
2. **Test Cases**: Add more edge cases to [`testing/static_cases.test.js`](testing/static_cases.test.js)
3. **Code Improvements**: Enhance the filtering logic in [`main.js`](main.js)

### Testing Your Changes

Always run the test suite after making changes:

```bash
npm run test-static
```

Aim to maintain or improve the current ~95% accuracy rate.

## Troubleshooting

**"Error: connect ECONNREFUSED"**
- Ensure Ollama is running: `systemctl start ollama.service`
- Check if the model is available: `ollama list`

**"Failed to parse response after maximum retries"**
- The AI is returning malformed JSON
- Try adjusting the prompt in `prompt.md`
- Check debug output with `.dev` file

**Tests failing unexpectedly**
- Verify Ollama model is working: `ollama run llama3.2:3b`
- Check if prompt.md has been modified
- AI responses can vary, some variance is normal