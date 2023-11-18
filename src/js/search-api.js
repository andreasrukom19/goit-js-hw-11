import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40733277-6610d0094f5f4332b1318844b';

export async function onDataSearch(currentPage, searchQuery) {
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: currentPage,
    per_page: '40',
  });

  try {
    const response = await axios.get(`${BASE_URL}?${searchParams}`);
    return response.data;
  } catch (error) {
    throw error;
  }
  
}