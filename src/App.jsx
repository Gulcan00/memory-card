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
      setBestScore(catsClicked.size);
      setCatsClicked(new Set());
    } else {
      const newCatsClicked = new Set(catsClicked);
      newCatsClicked.add(id);
      setCatsClicked(newCatsClicked);
    }
  };

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

  useEffect(() => {
    const cards = document.querySelectorAll('.card.trigger-flip');
    cards.forEach((card) => {
      card.classList.remove('trigger-flip');
    });
  }, [cats]);

  if (totalCats === catsClicked.size && cats.length > 0) {
    return <h1>You win</h1>;
  }

  return (
    <>
      <header>
        <h2>Current Score: {catsClicked.size}</h2>
        <h2>Best Score: {bestScore}</h2>
      </header>
      <main className="cards-container">
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

              const shuffledCats = shuffle(cats);
              setTimeout(() => {
                setCats(shuffledCats);
              }, 2000);
            }}
          />
        ))}
      </main>
    </>
  );
}

export default App;
