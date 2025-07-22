// genres.js

const API_KEY = '22d74813ded3fecbe3ef632b4814ae3a';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

// Genre name to TMDB genre ID mapping
const genreMap = {
  Action: 28,
  Adventure: 12,
  Comedy: 35,
  Crime: 80,
  Drama: 18,
  Fantasy: 14,
  "Sci-Fi": 878,
  Thriller: 53
};

document.addEventListener("DOMContentLoaded", () => {
  const genreButtons = document.querySelectorAll(".genre-button");
  const topPickList = document.querySelector(".top-pick-list");
  const topPickTitle = document.querySelector(".top-picks h2");

  // Load default genre
  loadGenreMovies("Action");

  // Bind click event to all genre buttons
  genreButtons.forEach(button => {
    button.addEventListener("click", () => {
      const genreName = button.textContent.trim();
      if (genreMap[genreName]) {
        loadGenreMovies(genreName);
      }
    });
  });

  // Main loader for movies by genre
  async function loadGenreMovies(genreName) {
    const genreId = genreMap[genreName];
    if (!genreId) return;

    topPickTitle.textContent = `Top Picks in ${genreName}`;
    topPickList.innerHTML = `<p style="color: #ccc;">Loading ${genreName} movies...</p>`;

    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&language=en-US`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response failed");
      const data = await response.json();

      const movies = data.results.filter(movie => movie.poster_path).slice(0, 12);

      if (movies.length === 0) {
        topPickList.innerHTML = `<p style="color: white;">No movies found for ${genreName}</p>`;
        return;
      }

      topPickList.innerHTML = ''; // Clear previous content

      for (const movie of movies) {
        const item = document.createElement("div");
        item.className = "top-pick-item";
        item.innerHTML = `
          <img src="${IMG_URL}${movie.poster_path}" alt="${movie.title}">
          <div class="top-pick-description">
            <strong>${movie.title}</strong><br>
            ${movie.overview.length > 150 ? movie.overview.slice(0, 150) + '...' : movie.overview}
          </div>
        `;
        item.onclick = () => {
          window.location.href = `movie.html?id=${movie.id}&type=movie`;
        };
        topPickList.appendChild(item);
      }
    } catch (error) {
      console.error("Error loading genre movies:", error);
      topPickList.innerHTML = `<p style="color: red;">Failed to load ${genreName} movies.</p>`;
    }
  }
});
