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
     const mapsQuery = encodeURIComponent(
    `${cafe.name} café Caracas Venezuela`
  );

  const mapsUrl =
    `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

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

      <a
  href="${mapsUrl}"
  target="_blank"
  rel="noopener noreferrer"
>
  Ver en Google Maps
</a>
    `;

    coffeeShopList.appendChild(card);
  });

  updateResultCount(allCafes.length);
}

function normalizeText(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function updateResultCount(count) {
  resultCount.textContent =
    `${count} ${count === 1 ? "café" : "cafés"}`;
}
function filterCoffeeShops() {
  const query = normalizeText(searchInput.value.trim());

  const cards = Array.from(
    document.querySelectorAll(".coffee-card")
  );

  let visibleCount = 0;

  cards.forEach(card => {
    const name = normalizeText(card.dataset.name || "");
    const zone = normalizeText(card.dataset.zone || "");
    const cost = normalizeText(card.dataset.cost || "");
    const notes = normalizeText(card.dataset.notes || "");

    // Convierte zonas como "centro-este"
    // en palabras independientes: ["centro", "este"]
    const zoneWords = zone
      .replace(/-/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    // Convierte lo que busca el usuario en palabras
    const queryWords = query
      .replace(/-/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    // Para nombre, costo y notas permitimos coincidencias parciales
    const generalSearch =
      name.includes(query) ||
      cost.includes(query) ||
      notes.includes(query);

    // Para zona exigimos palabras completas
    // Así "este" NO coincide con "oeste"
    const zoneMatch =
      queryWords.length > 0 &&
      queryWords.every(word =>
        zoneWords.includes(word)
      );

    const matches =
      query === "" ||
      generalSearch ||
      zoneMatch;

    card.hidden = !matches;

    if (matches) {
      visibleCount++;
    }
  });

  updateResultCount(visibleCount);

  emptyState.hidden =
    visibleCount !== 0;
}

searchInput.addEventListener("input", filterCoffeeShops);

loadCafes();
