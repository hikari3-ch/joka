const fs = require('fs');
const process = require('process');
const ollama = require('ollama').default;

export default async function main(arg0) {
    try {
        const prompt = fs.readFileSync("prompt.md", "utf8")
            .replace("CONTENT_PLACEHOLDER_:p", arg0);
        
        console.log(prompt);
        console.log("----------------------------");

        const response = await ollama.chat({
            model: "llama3.2:3b",
            messages: [
                { role: "user", content: prompt },
            ],
        });
        
        console.log(response.message.content);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    if (process.argv.length < 3) {
        console.log("Missing content.");
        process.exit(2);
    } else if (process.argv.length > 3) {
        console.log("Too many args.");
        process.exit(2);
    } else {
        main(process.argv[2]);
    }
}