
import dotenv from "dotenv";
import { createRequire } from "node:module";

// Load variables from the .env file in the current directory.
dotenv.config();

// Load the generated SDK, which is CommonJS.
const require = createRequire(import.meta.url);
const { TavilySDK } = require("./dist/TavilySDK.js");

async function main() {
  const apiKey = process.env.TAVILY_APIKEY;

  if (!apiKey) {
    throw new Error(
      "TAVILY_APIKEY is missing. Check your .env file."
    );
  }

  const client = new TavilySDK({
    apikey: apiKey,
  });

  try {
    const search = await client.Search().create({
      query: "What is satellite remote sensing?",
      max_results: 2,
    });

    console.log("Live Tavily request succeeded!");
    console.log(JSON.stringify(search.data(), null, 2));
  } catch (error) {
    console.error("SDK request failed:", error.message);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Test failed:", error.message);
  process.exitCode = 1;
});
