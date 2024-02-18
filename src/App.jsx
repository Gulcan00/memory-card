import { useState, useEffect } from 'react';
import './styles/App.css';
import Card from './components/Card';
import { fetchCats, shuffle } from './utils';
import RadioGroup from './components/RadioGroup';

function App() {
  const [cats, setCats] = useState([]);
  const [catsClicked, setCatsClicked] = useState(new Set());
  const [bestScore, setBestScore] = useState(0);
  const [dialogText, setDialogText] = useState('');
  const [numOfCards, setNumOfCards] = useState('8');

  const totalCats = cats.length;
  const currentScore = catsClicked.size;

  const updateBestScore = (newScore) => {
    const bestScoreLocal = parseInt(localStorage.getItem('bestScore'));
    const newBestScore = Math.max(newScore, bestScoreLocal);
    setBestScore(newBestScore);
    localStorage.setItem('bestScore', newBestScore);
  };

  const handleCardClick = (id) => {
    const dialog = document.getElementById('dialog');
    const title = dialog.querySelector('h1');
    if (catsClicked.has(id)) {
      updateBestScore(currentScore);
      dialog.classList.add('lose');
      setDialogText('You lose!');
      dialog.showModal();
      title.focus();
    } else {
      const newCatsClicked = new Set(catsClicked);
      newCatsClicked.add(id);
      setCatsClicked(newCatsClicked);
      if (totalCats === newCatsClicked.size && totalCats > 0) {
        updateBestScore(newCatsClicked.size);
        dialog.classList.add('win');
        setDialogText('You win!');
        dialog.showModal();
        title.focus();
      }
    }
  };

  useEffect(() => {
    const bestScoreLocal = localStorage.getItem('bestScore');
    if (bestScoreLocal) {
      setBestScore(bestScoreLocal);
    } else {
      localStorage.setItem('bestScore', 0);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    fetchCats(numOfCards)
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
  }, [numOfCards]);

  return (
    <>
      <header>
        <div className="container flex">
          <h1 className="title">MeowMory</h1>
          <RadioGroup
            selected={numOfCards}
            onChange={(e) => setNumOfCards(e.target.value)}
          />
          <div className="score-container">
            <h2>Current Score: {currentScore}</h2>
            <h2>Best Score: {bestScore}</h2>
          </div>
        </div>
      </header>
      <main className="container">
        <p className="status">
          {currentScore} / {totalCats}
        </p>
        <div className="cards-container">
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
        </div>
      </main>
      <dialog
        id="dialog"
        onClose={(e) => {
          e.target.className = '';
          fetchCats(numOfCards)
            .then((response) => response.json())
            .then((data) => setCats(data))
            .catch((e) => console.log(e));
          setCatsClicked(new Set());
        }}
        aria-labelledby="dialog__title"
      >
        <h1 id="dialog__title">{dialogText}</h1>
        <button
          onClick={(e) => {
            const dialog = e.target.parentNode;
            dialog.close();
          }}
          className="btn restart"
        >
          Restart
        </button>
      </dialog>
    </>
  );
}

export default App;
