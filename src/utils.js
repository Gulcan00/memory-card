const API_KEY =
  'live_qDLRbd6WozId1mE6zObkFVs2fRyDMUmK5HiaMZ35ksG9oBx9IMYsmXOiUQSzz2Z1';

export function fetchCats(count = 8) {
  return fetch(
    `https://api.thecatapi.com/v1/images/search?limit=${count}&has_breeds=1&api_key=${API_KEY}`
  );
}
