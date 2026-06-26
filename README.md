# 🧩 ProblemHub

**Find DSA Problems Instantly** — Search coding challenges across LeetCode and Codeforces, all in one place.

---

## 🚀 Features

- 🔍 Search 3500+ DSA problems by topic, tag, or title
- ⚡ TF-IDF powered ranking for relevant results
- 🏆 Highlights the best match at the top
- 📦 Covers problems from **LeetCode** and **Codeforces**
- 🖥️ Clean, minimal UI with instant results

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express |
| Search Algorithm | TF-IDF (via `natural` library) |
| Scraping | Puppeteer |
| Text Processing | `stopword` |

---

## 📁 Project Structure

```
problemhub/
├── assets/
│   └── logos/          # Platform logos (LeetCode, Codeforces, CodeChef)
├── corpus/
│   └── all_problems.json   # Merged problem dataset
├── problems/
│   ├── leetcode_problems.json
│   └── codeforces_problems.json
├── utils/
│   ├── preprocess.js   # Text cleaning & stopword removal
│   └── merge.js        # Merges scraped data into one corpus
├── index.html          # Frontend UI
├── styles.css          # Styling
├── script.js           # Frontend logic
├── index.js            # Express server + search endpoint
└── scrape.js           # Puppeteer scraper for LeetCode & Codeforces
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/problemhub.git

# 2. Navigate into the project
cd problemhub

# 3. Install dependencies
npm install

# 4. Start the server
npm start
```

Then open your browser and go to:
```
http://localhost:3000
```

---

## 🔄 Re-scraping Problems (Optional)

The corpus is already included, so this step is **not required**. But if you want fresh data:

```bash
# Scrape LeetCode and Codeforces
npm run scrape

# Merge scraped data into one corpus file
npm run merge
```

---

## 🧠 How It Works

1. On startup, the server loads all problems and builds a **TF-IDF index**
2. Each problem's title (weighted double) and description are tokenized and indexed
3. When you search, your query is converted into a TF-IDF vector
4. **Cosine similarity** is computed between your query and every problem
5. Top 10 most relevant results are returned and displayed

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the production server |
| `npm run dev` | Start with auto-reload (nodemon) |
| `npm run scrape` | Scrape problems from LeetCode & Codeforces |
| `npm run merge` | Merge scraped JSON files into corpus |

---

## 📄 License

ISC