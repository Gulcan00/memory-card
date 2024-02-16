import '../styles/Card.css';

export default function Card({ src, text }) {
  return (
    <div className="container">
      <button className="card">
        <span className="card__face card__face--front">
          <img src={src} alt="" />
          <p>{text}</p>
        </span>
        <span className="card__face card__face--back">
          <p>the back!</p>
        </span>
      </button>
    </div>
  );
}
