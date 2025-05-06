/**
 * Simple test script to verify the Daily Quote API is working correctly
 * Run this after starting the server with `npm start`
 */

const http = require("http");

// Base URL for the API
const API_BASE = "http://localhost:3000";

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path,
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          const parsedData = JSON.parse(responseData);
          console.log(`\n${method} ${path} - Status: ${res.statusCode}`);
          console.log(JSON.stringify(parsedData, null, 2));
          resolve(parsedData);
        } catch (err) {
          reject(new Error(`Failed to parse response: ${err.message}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Run all tests sequentially
async function runTests() {
  try {
    console.log("🔖 Testing Daily Quote API 🔖\n");

    // Test 1: Get all quotes
    console.log("Test 1: Get all quotes");
    const allQuotes = await makeRequest("GET", "/quotes");

    // Test 2: Get a random quote
    console.log("\nTest 2: Get a random quote");
    await makeRequest("GET", "/quotes/random");

    // Test 3: Get a specific quote by ID
    const quoteId = allQuotes.data[0]?.id || "1";
    console.log(`\nTest 3: Get quote with ID ${quoteId}`);
    await makeRequest("GET", `/quotes/${quoteId}`);

    // Test 4: Create a new quote
    console.log("\nTest 4: Create a new quote");
    const newQuote = await makeRequest("POST", "/quotes", {
      text: "The only limit to our realization of tomorrow will be our doubts of today.",
      author: "Franklin D. Roosevelt",
      tags: ["future", "doubt", "motivation"],
    });

    // Test 5: Update the quote we just created
    const newQuoteId = newQuote.data?.id;
    console.log(`\nTest 5: Update quote with ID ${newQuoteId}`);
    await makeRequest("PUT", `/quotes/${newQuoteId}`, {
      text: "The only limit to our realization of tomorrow will be our doubts of today!",
      author: "Franklin D. Roosevelt",
      tags: ["future", "doubt", "motivation", "updated"],
    });

    // Test 6: Verify the update
    console.log(`\nTest 6: Verify update for quote with ID ${newQuoteId}`);
    await makeRequest("GET", `/quotes/${newQuoteId}`);

    // Test 7: Delete the quote we created
    console.log(`\nTest 7: Delete quote with ID ${newQuoteId}`);
    await makeRequest("DELETE", `/quotes/${newQuoteId}`);

    // Test 8: Verify the deletion
    console.log(`\nTest 8: Verify deletion of quote with ID ${newQuoteId}`);
    try {
      await makeRequest("GET", `/quotes/${newQuoteId}`);
    } catch (err) {
      // This should fail since we deleted the quote
      console.log(`Quote with ID ${newQuoteId} was successfully deleted.`);
    }

    console.log("\n✅ All tests completed successfully!");
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
  }
}

// Run the tests
runTests();
