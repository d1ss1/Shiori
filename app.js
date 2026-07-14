const searchInput = document.getElementById("searchInput");
const animeGrid = document.querySelector(".animeGrid");
const logoText = document.querySelector("logoText");

let animeData = [];
let currentlang = "English";
const query = `{ animes(limit: 48) { id name russian kind airedOn { year } poster { originalUrl } } }`;
const kindLabels = {
  tv: "TV Series",
  movie: "Movie",
  ova: "OVA",
  ona: "ONA",
  special: "Special",
  tv_special: "TV Special",
};

function renderData(animeList) {
  animeGrid.innerHTML = "";
  animeList.forEach((element) => {
    const divCard = document.createElement("div");
    const meta = document.createElement("div");
    const spanCard = document.createElement("span");
    const kind = document.createElement("span");
    const airedOn = document.createElement("span");
    spanCard.textContent = (function (anime) {
      const title =
        currentlang === "English" ? anime.name : anime.russian || anime.name;
      return title.length > 18 ? title.slice(0, 18) + "..." : title;
    })(element);
    kind.textContent = kindLabels[element.kind] || element.kind;
    airedOn.textContent = element.airedOn.year;
    const posterImg = document.createElement("img");
    posterImg.src = element.poster.originalUrl;
    divCard.classList.add("card");
    meta.classList.add("meta");
    divCard.appendChild(posterImg);
    divCard.appendChild(spanCard);
    meta.appendChild(kind);
    meta.appendChild(airedOn);
    divCard.appendChild(meta);
    animeGrid.appendChild(divCard);
  });
}
document.getElementById("langRu").addEventListener("click", function (event) {
  currentlang = "Russian";
  renderData(animeData);
});
document.getElementById("langEng").addEventListener("click", function (event) {
  currentlang = "English";
  renderData(animeData);
});
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const text = searchInput.value.trim();
    async function searchAnime() {
      const searchUrl = "https://shikimori.io/api/graphql";
      const searchOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `{ animes(limit: 50, search: "${text}") { id name russian kind airedOn { year } poster { originalUrl } } }`,
        }),
      };

      try {
        console.log("sending a request");
        const response = await fetch(searchUrl, searchOptions);

        if (!response.ok) {
          throw new Error(`Server error, status: ${response.status}`);
        }
        const searchData = await response.json();
        animeData = searchData.data.animes;
        renderData(searchData.data.animes);
        return searchData;
      } catch (error) {
        console.error("Error during request:", error.message);
      }
    }
    searchAnime();
  }
});

async function loadTopAnime() {
  const topUrl = "https://shikimori.io/api/graphql";
  const topOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  };

  try {
    console.log("sending a request");
    const response = await fetch(topUrl, topOptions);

    if (!response.ok) {
      throw new Error(`Server error, status: ${response.status}`);
    }
    const topData = await response.json();
    animeData = topData.data.animes;
    renderData(topData.data.animes);
    return topData;
  } catch (error) {
    console.error("Error during request:", error.message);
    return [];
  }
}
loadTopAnime();
