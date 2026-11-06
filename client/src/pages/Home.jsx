import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import ChocolateCard from '../components/ChocolateCard';

export default function Home() {
  const [chocolates, setChocolates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/chocolates')
      .then(res => setChocolates(res.data))
      .finally(() => setLoading(false));
  }, []);

  const groups = [];
  for (const c of chocolates) {
    const last = groups[groups.length - 1];
    if (last && last.manufacturer._id === c.manufacturer._id) last.items.push(c);
    else groups.push({ manufacturer: c.manufacturer, items: [c] });
  }

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Craft Chocolate</p>
        <h1>Handcrafted chocolate<br />from the world's finest makers</h1>
        <p>{chocolates.length} bars · {groups.length} makers</p>
      </section>

      <div className="page-header">
        <h1>Chocolates</h1>
        {user?.role === 'admin' && <Link to="/chocolates/new" className="button">+ Add chocolate</Link>}
      </div>
      {chocolates.length === 0 && <p className="muted">No chocolates yet.</p>}
      {groups.map(g => (
        <section key={g.manufacturer._id} className="group">
          <h2>
            <Link to={`/manufacturers/${g.manufacturer._id}`}>{g.manufacturer.name}</Link>
            <span className="muted"> · {g.manufacturer.country}</span>
          </h2>
          <div className="grid">
            {g.items.map(c => <ChocolateCard key={c._id} chocolate={c} />)}
          </div>
        </section>
      ))}
    </>
  );
}
