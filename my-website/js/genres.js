// genres.js
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

const API_KEY = '22d74813ded3fecbe3ef632b4814ae3a';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

document.addEventListener("DOMContentLoaded", () => {
  const genreButtons = document.querySelectorAll('.genre-button');
  const topPickList = document.querySelector('.top-pick-list');
  const topPickTitle = document.querySelector('.top-picks h2');

  // Load default genre on page load
  loadGenreMovies("Action");

  genreButtons.forEach(button => {
    button.addEventListener("click", () => {
      const genreName = button.textContent.trim();
      loadGenreMovies(genreName);
    });
  });

  async function loadGenreMovies(genreName) {
    const genreId = genreMap[genreName];
    if (!genreId) return;

    topPickTitle.textContent = `Top Picks in ${genreName}`;
    topPickList.innerHTML = '<p style="color: white;">Loading...</p>';

    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&language=en-US`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        topPickList.innerHTML = `<p style="color: white;">No movies found in ${genreName}</p>`;
        return;
      }

      topPickList.innerHTML = '';

      data.results.slice(0, 12).forEach(movie => {
        if (!movie.poster_path) return;

        const item = document.createElement("div");
        item.classList.add("top-pick-item");
        item.innerHTML = `
          <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
          <div class="top-pick-description">
            <strong>${movie.title}</strong><br>
            ${movie.overview.length > 150 ? movie.overview.slice(0, 150) + "..." : movie.overview}
          </div>
        `;

        item.addEventListener("click", () => {
          window.location.href = `movie.html?id=${movie.id}&type=movie`;
        });

        topPickList.appendChild(item);
      });
    } catch (err) {
      topPickList.innerHTML = `<p style="color: red;">Error loading movies: ${err.message}</p>`;
      console.error("Failed to load genre content:", err);
    }
  }
});
