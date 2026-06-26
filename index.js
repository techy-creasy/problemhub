import express from "express";
import fs from "fs/promises";
import pkg from "natural";

import preprocess from "./utils/preprocess.js";

const { TfIdf } = pkg;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("."));

let problems = [];
let tfidf = new TfIdf();

// Precomputed term weight vectors and their magnitudes for cosine similarity
let termWeights = [];
let vectorNorms = [];

async function buildSearchIndex() {
  const raw = await fs.readFile("./corpus/all_problems.json", "utf-8");
  problems = JSON.parse(raw);

  tfidf = new TfIdf();

  problems.forEach((problem, idx) => {
    // Title is weighted double to boost exact/near-exact title matches
    const text = preprocess(
      `${problem.title} ${problem.title} ${problem.description || ""}`
    );
    tfidf.addDocument(text, idx.toString());
  });

  termWeights = [];
  vectorNorms = [];

  problems.forEach((_, idx) => {
    const vector = {};
    let sumSquares = 0;

    tfidf.listTerms(idx).forEach(({ term, tfidf: weight }) => {
      vector[term] = weight;
      sumSquares += weight * weight;
    });

    termWeights[idx] = vector;
    vectorNorms[idx] = Math.sqrt(sumSquares);
  });

  console.log(`✅ Index built — ${problems.length} problems loaded.`);
}

app.post("/search", async (req, res) => {
  const rawQuery = req.body.query;

  if (!rawQuery || typeof rawQuery !== "string") {
    return res.status(400).json({ error: "Query must be a non-empty string." });
  }

  const query = preprocess(rawQuery);
  const tokens = query.split(" ").filter(Boolean);

  // Build TF-IDF vector for the search query
  const termFreq = {};
  tokens.forEach((token) => {
    termFreq[token] = (termFreq[token] || 0) + 1;
  });

  const queryVector = {};
  let sumSqQ = 0;
  const totalTokens = tokens.length;

  Object.entries(termFreq).forEach(([term, count]) => {
    const tf = count / totalTokens;
    const idf = tfidf.idf(term);
    const weight = tf * idf;
    queryVector[term] = weight;
    sumSqQ += weight * weight;
  });

  const queryNorm = Math.sqrt(sumSqQ) || 1;

  // Score each problem using cosine similarity
  const ranked = problems.map((_, idx) => {
    const docVector = termWeights[idx];
    const docNorm = vectorNorms[idx] || 1;
    let dotProduct = 0;

    for (const [term, queryWeight] of Object.entries(queryVector)) {
      if (docVector[term]) {
        dotProduct += queryWeight * docVector[term];
      }
    }

    const cosineScore = dotProduct / (queryNorm * docNorm);
    return { idx, score: cosineScore };
  });

  const topResults = ranked
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(({ idx }) => {
      const problem = problems[idx];
      const platform = problem.url.includes("leetcode.com")
        ? "LeetCode"
        : "Codeforces";
      return { ...problem, platform };
    });

  res.json({ results: topResults });
});

buildSearchIndex().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 ProblemHub running on http://localhost:${PORT}`);
  });
});
