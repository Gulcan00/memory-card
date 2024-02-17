const API_KEY =
  'live_qDLRbd6WozId1mE6zObkFVs2fRyDMUmK5HiaMZ35ksG9oBx9IMYsmXOiUQSzz2Z1';

export function fetchCats(count = 8) {
  return fetch(
    `https://api.thecatapi.com/v1/images/search?limit=${count}&has_breeds=1&api_key=${API_KEY}`
  );
}

export function shuffle(arr) {
  const shuffledArr = [...arr];
  for (let i = shuffledArr.length - 1; i > 0; i--) {
    const randIndex = Math.floor(Math.random() * (i + 1));
    [shuffledArr[i], shuffledArr[randIndex]] = [
      shuffledArr[randIndex],
      shuffledArr[i],
    ];
  }

  return shuffledArr;
}
