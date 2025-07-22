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
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`);
  const data = await res.json();
  return data.results;
}

function displayGenreItems(items) {
  const container = document.getElementById('genre-content');
  container.innerHTML = '';

  const row = document.createElement('div');
  row.className = 'genre-row';

  items.forEach(item => {
    const wrapper = document.createElement('div');
    wrapper.className = 'poster-wrapper';

    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.className = 'genre-poster';
    img.onmouseenter = () => showDescription(item);

    wrapper.appendChild(img);
    row.appendChild(wrapper);
  });

  container.appendChild(row);
}

function showDescription(item) {
  const descBox = document.getElementById('genre-description');
  descBox.innerHTML = '';

  const title = document.createElement('h3');
  title.textContent = item.title || item.name;

  const desc = document.createElement('p');
  desc.textContent = item.overview.length > 300 ? item.overview.slice(0, 300) + '... ' : item.overview;

  if (item.overview.length > 300) {
    const more = document.createElement('span');
    more.textContent = 'More Information';
    more.className = 'more-info';
    more.onclick = () => showDetails(item);
    desc.appendChild(more);
  }

  descBox.appendChild(title);
  descBox.appendChild(desc);
}

function setupGenreButtons() {
  document.querySelectorAll('.genre-btn').forEach(btn => {
    btn.onclick = async () => {
      const genre = btn.textContent;
      document.getElementById('genre-title').textContent = `Top Picks in ${genre}`;
      const results = await fetchByGenre(genreMap[genre]);
      displayGenreItems(results);
    };
  });
}

function showDetails(item) {
  currentItem = item;
  document.getElementById('modal-title').textContent = item.title || item.name;
  document.getElementById('modal-description').textContent = item.overview;
  document.getElementById('modal-image').src = `${IMG_URL}${item.poster_path}`;
  document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(item.vote_average / 2));
  changeServer();
  document.getElementById('modal').style.display = 'flex';
}

function changeServer() {
  const server = document.getElementById('server').value;
  const type = currentItem.media_type === 'movie' ? 'movie' : 'tv';
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
  const query = document.getElementById('search-input').value;
  if (!query.trim()) {
    document.getElementById('search-results').innerHTML = '';
    return;
  }

  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`);
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
  document.getElementById('genre-title').textContent = `Top Picks in ${defaultGenre}`;
  const results = await fetchByGenre(genreMap[defaultGenre]);
  displayGenreItems(results);
}

init();
