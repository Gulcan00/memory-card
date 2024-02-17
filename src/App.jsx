import { useState, useEffect } from 'react';
import './styles/App.css';
import Card from './components/Card';
import { fetchCats } from './utils';

function App() {
  const [cats, setCats] = useState([]);

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

  return (
    <>
      <div className="cards-container">
        {cats.map((cat) => (
          <Card key={cat.id} src={cat.url} text={cat.breeds[0].name} />
        ))}
      </div>
    </>
  );
}

export default App;
