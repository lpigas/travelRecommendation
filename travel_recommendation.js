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
  if (k === "usa" || k === "united states" || k === "america" || k === "сша") return "countries";
  if (k === "japan" || k === "япония") return "countries";
  if (k === "australia" || k === "австралия") return "countries";
  if (k === "brazil" || k === "бразилия") return "countries";

  return null;
}

function clearResults() {
  document.getElementById("results").innerHTML = "";
}

function hideTimeBox() {
  const timeBox = document.getElementById("timeBox");
  if (!timeBox) return;
  timeBox.classList.add("hidden");
  timeBox.innerHTML = "";
}

function showTimeBox(timeZone) {
  const timeBox = document.getElementById("timeBox");
  if (!timeBox) return;

  const options = {
    timeZone,
    hour12: true,
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  };

  const localTime = new Date().toLocaleTimeString("en-US", options);

  timeBox.classList.remove("hidden");
  timeBox.innerHTML = `Current Local Time (${timeZone}): ${localTime}`;
}

function getTimeZoneForKeyword(keyword) {
  const k = normalizeKeyword(keyword);

  if (k === "usa" || k === "united states" || k === "america" || k === "сша") return "America/New_York";
  if (k === "japan" || k === "япония") return "Asia/Tokyo";
  if (k === "australia" || k === "австралия") return "Australia/Sydney";
  if (k === "brazil" || k === "бразилия") return "America/Sao_Paulo";

  return null;
}

function showResults(category, keywordInput) {
  const resultsDiv = document.getElementById("results");
  clearResults();
  hideTimeBox();

  if (category === "countries") {
    const tz = getTimeZoneForKeyword(keywordInput);
    if (tz) showTimeBox(tz);

    travelData.countries.forEach((country) => {
      country.cities.forEach((city) => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <img src="images/${city.imageUrl}" alt="${city.name}" />
          <div class="card-body">
            <h3>${city.name}</h3>
            <p>${city.description}</p>
            <button class="visit-btn">Visit</button>
          </div>
        `;

        resultsDiv.appendChild(card);
      });
    });

    return;
  }

  const items = travelData[category];

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="images/${item.imageUrl}" alt="${item.name}" />
      <div class="card-body">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <button class="visit-btn">Visit</button>
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
    hideTimeBox();
    alert("❌ No matching category. Try: beach / temple / country / usa / japan");
    return;
  }

  showResults(category, input);
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchData();

  const searchBtn = document.getElementById("searchBtn");
  const clearBtn = document.getElementById("clearBtn");

  searchBtn.addEventListener("click", handleSearch);

  clearBtn.addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    clearResults();
    hideTimeBox();
  });
});