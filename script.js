const form = document.getElementById("search-form");
const input = document.getElementById("query-input");
const resultsDiv = document.getElementById("results");
const spinner = document.getElementById("spinner");

function buildResultCard(problem, index) {
  const isBestMatch = index === 0;
  const platformName = problem.platform.toLowerCase();

  return `
    <div class="card${isBestMatch ? " featured" : ""}">
      <div class="card-header">
        <img
          src="assets/logos/${platformName}.png"
          alt="${problem.platform} logo"
          class="platform-logo"
        />
        <a href="${problem.url}" target="_blank" class="card-title">
          [${problem.platform}] ${problem.title}
        </a>
      </div>
    </div>
  `;
}

function showError(message) {
  resultsDiv.innerHTML = `<p style="color:#c0392b;">Something went wrong: ${message}</p>`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = input.value.trim();
  if (!query) return;

  resultsDiv.innerHTML = "";
  spinner.classList.remove("hidden");

  try {
    const response = await fetch("/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) throw new Error(`Server responded with ${response.status}`);

    const { results } = await response.json();

    spinner.classList.add("hidden");

    if (results.length === 0) {
      resultsDiv.innerHTML = `
        <p>No matches found for "<strong>${query}</strong>". Try a different keyword or topic.</p>
      `;
      return;
    }

    const cards = results.map((problem, i) => buildResultCard(problem, i)).join("");
    const countLine = `<p class="result-count">${results.length} result${results.length !== 1 ? "s" : ""} found</p>`;
    resultsDiv.innerHTML = countLine + cards;

  } catch (err) {
    spinner.classList.add("hidden");
    console.error(err);
    showError(err.message);
  }
});
