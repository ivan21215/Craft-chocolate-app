import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Manufacturers() {
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/manufacturers')
      .then(res => setManufacturers(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h1>Manufacturers</h1>
      <div className="grid">
        {manufacturers.map(m => (
          <Link key={m._id} to={`/manufacturers/${m._id}`} className="card">
            <h3>{m.name}</h3>
            <p className="muted">{m.country}{m.foundedYear && ` · since ${m.foundedYear}`}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
