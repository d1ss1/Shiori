const searchInput = document.getElementById("searchInput");
const animeGrid = document.querySelector(".animeGrid");

function renderData(animeList) {
  animeGrid.innerHTML = "";
  animeList.forEach(element => {
    const divCard = document.createElement("div");
    divCard.classList.add("card");
    divCard.textContent = element.title;
    animeGrid.appendChild(divCard)
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