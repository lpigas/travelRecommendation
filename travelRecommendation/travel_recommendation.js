let travelData = null;

async function fetchData() {
  try {
    const response = await fetch("travel_recommendation_api.json");
    const data = await response.json();
    console.log("JSON:", data);
    travelData = data;
  } catch (error) {
    console.error("Error loading JSON:", error);
  }
}

function normalizeKeyword(keyword) {
  return keyword.trim().toLowerCase();
}
function getCategory(keyword) {
  const k = normalizeKeyword(keyword);
  if (k === "beach" || k === "beaches" || k === "пляж" || k === "пляжи") return "beaches";
  if (k === "temple" || k === "temples" || k === "храм" || k === "храмы") return "temples";
  if (k === "country" || k === "countries" || k === "страна" || k === "страны") return "countries";

  return null;
}

function clearResults() {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
}

function getLocalTime(timeZone) {
  const options = {
    timeZone,
    hour12: true,
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  };
  return new Date().toLocaleTimeString("en-US", options);
}

function showResults(category) {
  const resultsDiv = document.getElementById("results");
  clearResults();

  const items = travelData[category];

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    let timeHtml = "";
    if (item.timeZone) {
      timeHtml = `<p class="time"><b>Local Time:</b> ${getLocalTime(item.timeZone)}</p>`;
    }

    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}" />
      <div class="card-body">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        ${timeHtml}
      </div>
    `;

    resultsDiv.appendChild(card);
  });
}

function handleSearch() {
  const input = document.getElementById("searchInput").value;

  if (!travelData) {
    alert("Data is still loading... try again in a second!");
    return;
  }

  const category = getCategory(input);

  if (!category) {
    clearResults();
    alert("❌ No matching category. Try: beach / temple / country");
    return;
  }

  showResults(category);
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchData();

  const searchBtn = document.getElementById("searchBtn");
  const clearBtn = document.getElementById("clearBtn");

  searchBtn.addEventListener("click", handleSearch);

  clearBtn.addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    clearResults();
  });
});