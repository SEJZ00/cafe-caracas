const searchInput = document.getElementById("searchInput");
const coffeeShopList = document.getElementById("coffeeShopList");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");

let allCafes = [];

// Load JSON
async function loadCafes() {
  try {
    const response = await fetch("cafes.json");
    const cafes = await response.json();
    renderCafes(cafes);
  } catch (error) {
    console.error("Error cargando cafés:", error);
  }
}

function renderCafes(cafes) {
  allCafes = cafes.filter(cafe => cafe.name);

  coffeeShopList.innerHTML = "";

  allCafes.forEach((cafe, index) => {
    const card = document.createElement("article");
    card.className = "coffee-card";

    card.dataset.name = cafe.name;
    card.dataset.zone = cafe.zone || "";
    card.dataset.cost = cafe.cost || "";
    card.dataset.notes = cafe.notes || "";

    card.innerHTML = `
      <div class="coffee-card__top">
        <span class="coffee-card__number">${String(index + 1).padStart(2, "0")}</span>
        <span class="coffee-card__tag">${cafe.zone}</span>
      </div>

      <h3>${cafe.name}</h3>

      <p>Rating: ${cafe.rate || "N/A"} · Costo: ${cafe.cost || "N/A"}</p>

      <div class="coffee-card__meta">
        <span>${cafe.notes || "sin notas"}</span>
      </div>

      <a href="${cafe.link}" target="_blank">Ver en Google Maps</a>
    `;

    coffeeShopList.appendChild(card);
  });

  updateResultCount(allCafes.length);
}

function normalizeText(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filterCoffeeShops() {
  const query = normalizeText(searchInput.value.trim());
  const cards = Array.from(document.querySelectorAll(".coffee-card"));

  let visibleCount = 0;

  cards.forEach(card => {
    const searchable = normalizeText(
      `${card.dataset.name} ${card.dataset.zone} ${card.dataset.cost} ${card.dataset.notes}`
    );

    const matches = searchable.includes(query);
    card.hidden = !matches;

    if (matches) visibleCount++;
  });

  updateResultCount(visibleCount);
  emptyState.hidden = visibleCount !== 0;
}

function updateResultCount(count) {
  resultCount.textContent = `${count} ${count === 1 ? "café" : "cafés"}`;
}

if (searchInput) {
  searchInput.addEventListener("input", filterCoffeeShops);
}

// Initial load
loadCafes();
