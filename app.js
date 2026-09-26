const searchInput = document.getElementById("searchInput");
const animeGrid = document.querySelector(".animeGrid");
const logoText = document.getElementById("logoText");
const mainHeadline = document.querySelector(".mainHeadline");
const animeDetails = document.getElementById("animeDetails");

let animeData = [];
let currentLang = "English";
const query = `{ animes(limit: 48) { id name russian kind airedOn { year } poster { originalUrl } rating score status episodes description } }`;
const kindLabels = {
  tv: "TV Series",
  movie: "Movie",
  ova: "OVA",
  ona: "ONA",
  special: "Special",
  tv_special: "TV Special",
};
const statusLabel = {
  released: { English: "released", Russian: "завершено" },
  ongoing: { English: "ongoing", Russian: "онгоинг" },
  anons: { English: "anons", Russian: "анонс" },
};
const ratingLabel = {
  g: "G",
  pg: "PG",
  pg_13: "PG-13",
  r: "R-17",
  r_plus: "R+",
};
const prefixEpisodes = currentLang === "English" ? "Episodes: " : "Эпизодов: ";
const prefixScore = currentLang === "English" ? "rating " : "рейтинг ";
function renderData(animeList) {
  animeGrid.innerHTML = "";
  animeList.forEach((element) => {
    const divCard = document.createElement("div");
    const divPopover = document.createElement("div");
    const hTitle = document.createElement("h4");
    const meta = document.createElement("div");
    const spanName = document.createElement("div");
    const spanCard = document.createElement("span");
    const kind = document.createElement("span");
    const divDescr = document.createElement("div");
    const divStatus = document.createElement("div");
    const divEpisodes = document.createElement("div");
    const divScore = document.createElement("div");
    const airedOn = document.createElement("span");
    const spanStatusLabel = document.createElement("span");
    const spanStatusValue = document.createElement("span");
    const spanScoreValue = document.createElement("span");

    divCard.addEventListener("click", function (event) {
      animeGrid.classList.add("hidden");
      animeDetails.classList.remove("hidden");
      animeDetails.textContent = "Loading...";
      loadAnimeDetails(element.id);
    });
    spanStatusLabel.textContent =
      currentLang === "English" ? "type: " : "тип: ";
    spanStatusValue.textContent = statusLabel[element.status]
      ? statusLabel[element.status][currentLang]
      : "no status";
    spanCard.textContent =
      currentLang === "English"
        ? element.name
        : element.russian || element.name;
    kind.textContent = kindLabels[element.kind] || element.kind;
    airedOn.textContent = element.airedOn.year;
    let rawText;
    if (element.description) {
      rawText = element.description;
    } else {
      rawText =
        currentLang === "English" ? "no description" : "отсутствует описание";
    }
    let cleanText = rawText.replace(/\[.*?\]/g, "") || "no description";
    if (cleanText.length > 155) {
      cleanText = cleanText.slice(0, 155) + "...";
    }
    divDescr.textContent = cleanText;
    divEpisodes.textContent =
      prefixEpisodes + (element.episodes || "no episodes");
    hTitle.textContent =
      currentLang === "English"
        ? element.name
        : element.russian || element.name;
    divScore.textContent = prefixScore;
    spanScoreValue.textContent = element.score || "no rating";
    const posterImg = document.createElement("img");
    posterImg.src = element.poster.originalUrl;
    divCard.classList.add("card");
    divPopover.classList.add("popover");
    spanStatusValue.classList.add("statusBadge", element.status);
    meta.classList.add("meta");
    spanName.classList.add("name");
    hTitle.classList.add("popoverTitle");
    divStatus.classList.add("statusContainer");
    spanScoreValue.classList.add("scoreValue");
    divScore.classList.add("score");
    divCard.appendChild(posterImg);
    spanName.appendChild(spanCard);
    meta.appendChild(kind);
    meta.appendChild(airedOn);
    divCard.appendChild(spanName);
    divCard.appendChild(meta);
    animeGrid.appendChild(divCard);
    divCard.appendChild(divPopover);
    divPopover.appendChild(hTitle);
    divPopover.appendChild(divDescr);
    divPopover.appendChild(divStatus);
    divPopover.appendChild(divEpisodes);
    divPopover.appendChild(divScore);
    divStatus.appendChild(spanStatusLabel);
    divStatus.appendChild(spanStatusValue);
    divScore.appendChild(spanScoreValue);
  });
}
mainHeadline.addEventListener("click", function () {
  searchInput.value = "";
  animeGrid.classList.remove("hidden");
  animeDetails.classList.add("hidden");
  loadTopAnime();
});
document.getElementById("langRu").addEventListener("click", function () {
  currentLang = "Russian";
  renderData(animeData);
});
document.getElementById("langEng").addEventListener("click", function () {
  currentLang = "English";
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
          query: `{ animes(limit: 50, search: "${text}") { id name russian kind airedOn { year } poster { originalUrl }  rating score status episodes description } }`,
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

async function loadAnimeDetails(id) {
  animeDetails.innerHTML = "";
  const searchDetails = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `{ animes(ids: "${id}"){ id name russian kind poster { originalUrl } rating score status episodes description } }`,
    }),
  };
  try {
    const response = await fetch(
      "https://shikimori.io/api/graphql",
      searchDetails,
    );
    const detailsData = await response.json();
    const anime = detailsData.data.animes[0];
    const title = document.createElement("h2");
    const type = document.createElement("div");
    const episodes = document.createElement("div");
    const status = document.createElement("span");
    const rating = document.createElement("span");
    const score = document.createElement("div");
    const description = document.createElement("div");
    title.textContent =
      currentLang === "English" ? anime.name : anime.russian || anime.name;
    animeDetails.appendChild(title);
    type.textContent = kindLabels[anime.kind] || anime.kind;
    const prefixEpisodes =
      currentLang === "English" ? "Episodes: " : "Эпизодов: ";
    episodes.textContent = prefixEpisodes + (anime.episodes || "no episodes");
    status.textContent =
      statusLabel[anime.status]?.[currentLang] || anime.status;
    const prefixRating = currentLang === "English" ? "Rating: " : "Рейтинг: ";
    rating.textContent =
      prefixRating + (ratingLabel[anime.rating] || "no rating");
    score.textContent = anime.score;
    let rawText;
    if (anime.description) {
      rawText = anime.description;
    } else {
      rawText =
        currentLang === "English" ? "no description" : "отсутствует описание";
    }
    let cleanText = rawText.replace(/\[.*?\]/g, "");
    description.textContent = cleanText;
    const contentWrapper = document.createElement("div");
    contentWrapper.classList.add("wrapper");
    const posterImg = document.createElement("img");
    posterImg.src = anime.poster.originalUrl;
    posterImg.classList.add("detailsPoster");
    const infoWrapper = document.createElement("div");
    const infoBlock = document.createElement("div");
    const scoreBlock = document.createElement("div");
    infoBlock.classList.add("detailsInfo");
    console.log(detailsData);
    contentWrapper.appendChild(posterImg);
    contentWrapper.appendChild(infoWrapper);
    infoWrapper.appendChild(infoBlock);
    infoWrapper.appendChild(scoreBlock);
    infoBlock.appendChild(type);
    infoBlock.appendChild(episodes);
    infoBlock.appendChild(status);
    infoBlock.appendChild(rating);
    scoreBlock.appendChild(score);
    animeDetails.appendChild(contentWrapper);
    animeDetails.appendChild(description);
  } catch (error) {
    console.log("Not found");
  }
}

loadTopAnime();
