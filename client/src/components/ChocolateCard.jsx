import { Link } from 'react-router-dom';

export default function ChocolateCard({ chocolate }) {
  return (
    <Link to={`/chocolates/${chocolate._id}`} className="card">
      <h3>{chocolate.name}</h3>
      <p className="muted">
        {chocolate.type}
        {chocolate.filling !== 'none' && ` · ${chocolate.filling}`}
        {chocolate.cocoaPercentage != null && ` · ${chocolate.cocoaPercentage}% cocoa`}
      </p>
      <p className="price">{chocolate.price.toFixed(2)} €</p>
    </Link>
  );
}
