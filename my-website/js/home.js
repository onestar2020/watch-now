const API_KEY = '69417ec87bd388d1e39d8d8307479574';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
let currentItem;

const genreMap = {
  'Action': 28,
  'Adventure': 12,
  'Comedy': 35,
  'Crime': 80,
  'Drama': 18,
  'Fantasy': 14,
  'Sci-Fi': 878,
  'Thriller': 53
};

async function fetchByGenre(genreId) {
  const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&language=en-US&page=1`);
  const data = await response.json();
  return data.results || [];
}

function displayGenreItems(items) {
  const container = document.getElementById('genre-results');
  container.innerHTML = '';

  const label = document.createElement('div');
  label.className = 'top-picks-label';
  label.textContent = 'TOP PICKS';
  container.appendChild(label);

  const row = document.createElement('div');
  row.className = 'genre-row';
  container.appendChild(row);

  const seen = new Set();
  items.filter(item => item.poster_path).forEach(item => {
    const uniqueKey = item.id;
    if (seen.has(uniqueKey)) return;
    seen.add(uniqueKey);

    const card = document.createElement('div');
    card.className = 'genre-card';
    card.innerHTML = `
      <img src="${IMG_URL}${item.poster_path}" alt="${item.title || item.name}">
      <h3>${item.title || item.name}</h3>
    `;
    card.onclick = () => showDetails(item);
    row.appendChild(card);
  });
}

function setupGenreButtons() {
  document.querySelectorAll('.genre-btn').forEach(btn => {
    btn.onclick = async () => {
      const genre = btn.textContent.trim();
      const genreId = genreMap[genre];
      if (!genreId) return;

      document.getElementById('genre-title').textContent = `${genre} Movies`;
      const results = await fetchByGenre(genreId);
      displayGenreItems(results);
    };
  });
}

function showDetails(item) {
  currentItem = item;
  document.getElementById('modal-title').textContent = item.title || item.name;
  document.getElementById('modal-description').textContent = item.overview || "No description available.";
  document.getElementById('modal-image').src = `${IMG_URL}${item.poster_path}`;
  document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(item.vote_average / 2));
  changeServer();
  document.getElementById('modal').style.display = 'flex';
}

function changeServer() {
  const server = document.getElementById('server').value;
  const type = currentItem.media_type === 'tv' ? 'tv' : 'movie';
  let embedURL = '';

  if (server === 'vidsrc.cc') {
    embedURL = `https://vidsrc.cc/v2/embed/${type}/${currentItem.id}`;
  } else if (server === 'vidsrc.me') {
    embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${currentItem.id}`;
  } else if (server === 'player.videasy.net') {
    embedURL = `https://player.videasy.net/${type}/${currentItem.id}`;
  }

  document.getElementById('modal-video').src = embedURL;
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
}

function openSearchModal() {
  document.getElementById('search-modal').style.display = 'flex';
  document.getElementById('search-input').focus();
}

function closeSearchModal() {
  document.getElementById('search-modal').style.display = 'none';
  document.getElementById('search-results').innerHTML = '';
}

async function searchTMDB() {
  const query = document.getElementById('search-input').value.trim();
  if (!query) {
    document.getElementById('search-results').innerHTML = '';
    return;
  }

  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  const data = await res.json();

  const container = document.getElementById('search-results');
  container.innerHTML = '';
  data.results.forEach(item => {
    if (!item.poster_path) return;
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.onclick = () => {
      closeSearchModal();
      showDetails(item);
    };
    container.appendChild(img);
  });
}

async function init() {
  setupGenreButtons();
  const defaultGenre = 'Action';
  document.getElementById('genre-title').textContent = `${defaultGenre} Movies`;
  const results = await fetchByGenre(genreMap[defaultGenre]);
  displayGenreItems(results);
}

init();
