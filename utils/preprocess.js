import { removeStopwords } from "stopword";

export default function preprocess(text) {
  const cleaned = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " "); // collapse multiple spaces into one

  return removeStopwords(cleaned.split(" ")).join(" ");
}
