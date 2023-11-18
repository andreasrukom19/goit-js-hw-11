import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import { onDataSearch } from "./search-api";
let countImg = 0;
let currentPage = 1;

const refs = {
  searchForm: document.querySelector('.search-form'),
  divGallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-btn'),
};

const lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

refs.searchForm.addEventListener('submit', onSubmitForm);
refs.loadBtn.addEventListener('click', onLoadMore);

async function getResult(searchQuery) {
  const data = await onDataSearch(currentPage, searchQuery);
  countImg += data.hits.length;
  return data;
}

async function onSubmitForm(event) {
  event.preventDefault();
  refs.divGallery.innerHTML = '';
  const searchQuery = event.target.elements.searchQuery.value.trim();
  localStorage.setItem('data-input', searchQuery);

  if (!searchQuery) {
    Notiflix.Notify.failure('Please enter search data');
  }

  try {
    const data = await getResult(searchQuery);
    createMarkupGallery(data.hits);

    if (data.totalHits > countImg && data.totalHits !== 0) {
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      refs.loadBtn.classList.remove('is-hidden');
    }
  } catch (error) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
  } finally {
    lightbox.refresh();
  }
}

async function onLoadMore() {
  try {
    const dataInput = localStorage.getItem('data-input');
    currentPage += 1;
    const data = await getResult(dataInput);

    if (data.hits.length < 40) {
      refs.loadBtn.classList.add('is-hidden');
      Notiflix.Notify.info('We&apos;re sorry, but you&apos;ve reached the end of search results.')
    }
    createMarkupGallery(data.hits);
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  } finally {
    lightbox.refresh();
  }
}

function createMarkupGallery(photos) {
  const markup = photos.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `
  <div class="photo-card">
    <a href="${largeImageURL}">
      <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <span class="info-title">Likes</span>
        <span class="data-info">${likes}</span>
      </p>
      <p class="info-item">
        <span class="info-title">Views</span>
        <span class="data-info">${views}</span>
      </p>
      <p class="info-item">
        <span class="info-title">Comments</span>
        <span class="data-info">${comments}</span>
      </p>
      <p class="info-item">
        <span class="info-title">Downloads</span>
        <span class="data-info">${downloads}</span>
      </p>
    </div>
  </div>`
  }).join('');
  refs.divGallery.insertAdjacentHTML('beforeend', markup);
}
