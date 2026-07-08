const searchInput = document.getElementById("searchInput");
const animeGrid = document.querySelector(".animeGrid");
const logoText = document.querySelector("logoText");

function renderData(animeList) {
  animeGrid.innerHTML = "";
  animeList.forEach((element) => {
    const divCard = document.createElement("div");
    const spanCard = document.createElement("span");
    const posterImg = document.createElement("img");
    posterImg.src = element.images.jpg.image_url;
    divCard.classList.add("card");
    divCard.appendChild(posterImg);
    spanCard.textContent = element.title;
    divCard.appendChild(spanCard);
    animeGrid.appendChild(divCard);
  });
}
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const text = searchInput.value.trim();
    async function searchAnime() {
      const searchUrl = `https://api.jikan.moe/v4/anime?q=${text}`;

      try {
        console.log("sending a request");
        const response = await fetch(searchUrl);

        if (!response.ok) {
          throw new Error(`Server error, status: ${response.status}`);
        }
        const searchData = await response.json();
        renderData(searchData.data);
        return searchData;
      } catch (error) {
        console.error("Error during request:", error.message);
      }
    }
    searchAnime();
  }
});

async function loadTopAnime() {
  const topUrl = "https://api.jikan.moe/v4/top/anime";

  try {
    console.log("sending a request");
    const response = await fetch(topUrl);

    if (!response.ok) {
      throw new Error(`Server error, status: ${response.status}`);
    }
    const topData = await response.json();
    renderData(topData.data);
    return topData;
  } catch (error) {
    console.error("Error during request:", error.message);
    return [];
  }
}
loadTopAnime();
