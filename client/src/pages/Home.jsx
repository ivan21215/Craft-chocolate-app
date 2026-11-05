import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ChocolateCard from '../components/ChocolateCard';

export default function Home() {
  const [chocolates, setChocolates] = useState([]);
  const [loading, setLoading] = useState(true);

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
  if (chocolates.length === 0) return <p>No chocolates yet.</p>;

  return (
    <>
      <h1>Chocolates</h1>
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
