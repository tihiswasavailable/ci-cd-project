import express from "express";
import fetch from "node-fetch";

const app = express();

// ejs
app.set("view engine", "ejs");

// routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/index", async (req, res) => {
  try {
    // Check for required query parameter
    if (!req.query.person) {
      return res.status(400).json({ error: "Person query is required" });
    }

    const params = new URLSearchParams({
      action: "opensearch",
      search: req.query.person,
      limit: "1",
      namespace: "0",
      format: "json",
    });

    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?${params}`,
    );

    if (!response.ok) {
      throw new Error("Wikipedia API error");
    }

    const data = await response.json();

    // Ensure we have valid data
    if (
      !data ||
      !Array.isArray(data) ||
      data.length < 4 ||
      !data[3] ||
      !data[3][0]
    ) {
      return res.status(404).json({ error: "Person not found" });
    }

    // Extract data ensuring we have values or empty strings
    const url = data[3][0] || "";
    const title = data[1][0] || "";
    const description = data[2][0] || "";

    // Return formatted response
    return res.json({ url, title, description });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default app;
