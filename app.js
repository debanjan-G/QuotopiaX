const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const request = require("request");
const { log } = require("console");

require("dotenv").config();

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/search", (req, res) => {
  res.render("search");
});

// log the value entered by user in the form
app.post("/search", (req, res) => {
  let url = "";
  console.log(req);
  if (req.body.hasOwnProperty("random-quote")) {
    url = "https://api.api-ninjas.com/v1/quotes";
  } else {
    const keywordInput = req.body.keyword;
    url = "https://api.api-ninjas.com/v1/quotes?category=" + keywordInput;
  }

  // console.log(keywordInput);

  const myApiKey = process.env.MY_API_KEY;

  request.get(
    {
      url: url,
      headers: {
        "X-Api-Key": myApiKey,
      },
    },
    (error, response, body) => {
      if (error) {
        console.error("Error:", error); // Print any request error.
      } else if (response.statusCode !== 200) {
        console.error("Error - Status Code:", response.statusCode); // Print the HTTP status code.
      } else {
        const data = JSON.parse(body); // Parse the JSON array

        // Check if the array is not empty
        if (Array.isArray(data) && data.length > 0) {
          const dataObject = data[0]; // Access the first (an only) item in the array
          console.log("Quote:", dataObject.quote);
          res.render("quote", {
            quote: "❝ " + dataObject.quote + " ❞",
            author: "— " + dataObject.author,
            category: dataObject.category,
          });
        } else {
          console.error("Empty or invalid JSON array.");
          res.render("invalid");
        }
      }
    }
  );
});

app.listen("3000", () => {
  console.log("Server started successfully on Port 3000.");
});
