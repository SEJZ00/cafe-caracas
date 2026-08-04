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
  <a
    class="coffee-card__link"
    href="${mapsUrl}"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Ver ${cafe.name} en Google Maps"
  >
    <div class="coffee-card__media">
      ${
        cafe.image
          ? `
            <img
              class="coffee-card__image"
              src="${cafe.image}"
              alt="${cafe.name}"
              loading="lazy"
            >
          `
          : `
            <div class="coffee-card__placeholder">
              <span>Caracas Café</span>
            </div>
          `
      }

      <button
        class="coffee-card__favorite"
        type="button"
        aria-label="Guardar ${cafe.name}"
      >
        ♡
      </button>
    </div>

    <div class="coffee-card__content">
      <div class="coffee-card__heading">
        <h3>${cafe.name}</h3>

        <span class="coffee-card__rating">
          ★ ${cafe.rate || "N/A"}
        </span>
      </div>

      <p class="coffee-card__location">
        ${cafe.location || cafe.zone || "Caracas"}
        ${
          cafe.category
            ? ` · ${cafe.category}`
            : ""
        }
      </p>

      <p class="coffee-card__price">
        ${cafe.cost || "Precio por verificar"}
      </p>
    </div>
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
