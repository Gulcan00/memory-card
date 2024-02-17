import { useState, useEffect } from 'react';
import './styles/App.css';
import Card from './components/Card';
import { fetchCats, shuffle } from './utils';

function App() {
  const [cats, setCats] = useState([]);
  const [catsClicked, setCatsClicked] = useState(new Set());
  const [bestScore, setBestScore] = useState(0);

  const totalCats = cats.length;

  const handleCardClick = (id) => {
    if (catsClicked.has(id)) {
      const bestScoreLocal = parseInt(localStorage.getItem('bestScore'));
      const newBestScore = Math.max(catsClicked.size, bestScoreLocal);
      setBestScore(newBestScore);
      localStorage.setItem('bestScore', newBestScore);
      setCatsClicked(new Set());
      fetchCats()
        .then((response) => response.json())
        .then((data) => setCats(data))
        .catch((e) => console.log(e));
    } else {
      const newCatsClicked = new Set(catsClicked);
      newCatsClicked.add(id);
      setCatsClicked(newCatsClicked);
    }
  };

  useEffect(() => {
    const bestScoreLocal = localStorage.getItem('bestScore');
    if (bestScoreLocal) {
      setBestScore(bestScoreLocal);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    fetchCats()
      .then((response) => response.json())
      .then((data) => {
        if (!ignore) {
          setCats(data);
        }
      })
      .catch((e) => console.log(e));

    return () => {
      ignore = true;
    };
  }, []);

  if (totalCats === catsClicked.size && cats.length > 0) {
    return (
      <div>
        <h1>You win!</h1>
        <button
          onClick={() => {
            fetchCats()
              .then((response) => response.json())
              .then((data) => setCats(data))
              .catch((e) => console.log(e));
            setCatsClicked(new Set());
          }}
        >
          Restart
        </button>
      </div>
    );
  }

  return (
    <>
      <header>
        <div className="container flex">
          <nav className="nav">
            <h1>MeowMory</h1>
          </nav>
          <div className="score-container">
            <h2>Current Score: {catsClicked.size}</h2>
            <h2>Best Score: {bestScore}</h2>
          </div>
        </div>
      </header>
      <main className="container cards-container">
        {cats.map((cat) => (
          <Card
            key={cat.id}
            src={cat.url}
            text={cat.breeds[0].name}
            onClick={(e) => {
              e.currentTarget.blur();
              handleCardClick(cat.id);
              // Flip cards
              const cards = document.querySelectorAll('.card');
              cards.forEach((card) => {
                card.classList.add('trigger-flip');
              });

              setTimeout(() => {
                const shuffledCats = shuffle(cats);
                setCats(shuffledCats);
              }, 800);
              setTimeout(() => {
                cards.forEach((card) => {
                  card.classList.remove('trigger-flip');
                });
              }, 1500);
            }}
          />
        ))}
      </main>
    </>
  );
}

export default App;
