import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Manufacturers() {
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/manufacturers')
      .then(res => setManufacturers(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="page-header">
        <h1>Manufacturers</h1>
        {user?.role === 'admin' && <Link to="/manufacturers/new" className="button">+ Add manufacturer</Link>}
      </div>
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
