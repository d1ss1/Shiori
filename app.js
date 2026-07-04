const searchInput = document.getElementById("searchInput");
const animeGrid = document.querySelector(".animeGrid");

function renderData(animeList) {
  animeGrid.innerHTML = "";
  animeList.forEach(element => {
    const divCard = document.createElement("div");
    const spanCard = document.createElement("span");
    const posterImg = document.createElement("img");
    posterImg.src = element.images.jpg.image_url
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
    fetch(`https://api.jikan.moe/v4/anime?q=${text}`)
    .then(response => response.json())
    .then(data => renderData(data.data))
  }
});