fetch('https://api.jikan.moe/v4/anime?q=naruto')
.then(response => response.json())
.then(data => console.log(data))