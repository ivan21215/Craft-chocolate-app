import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function ChocolateDetails() {
  const { id } = useParams();
  const [chocolate, setChocolate] = useState(null);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    api.get(`/chocolates/${id}`)
      .then(res => setChocolate(res.data))
      .catch(err => setError(err.response?.data?.message || 'Could not load chocolate'));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${chocolate.name}"?`)) return;
    try {
      await api.delete(`/chocolates/${id}`);
      navigate('/');
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not delete chocolate');
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!chocolate) return <p>Loading...</p>;

  const m = chocolate.manufacturer;

  return (
    <article className="details">
      <Link to="/">← Back to chocolates</Link>
      {chocolate.imageUrl && <img src={chocolate.imageUrl} alt={chocolate.name} className="photo" />}
      <h1>{chocolate.name}</h1>
      <p className="price">{chocolate.price.toFixed(2)} €</p>

      <dl>
        <dt>Manufacturer</dt>
        <dd><Link to={`/manufacturers/${m._id}`}>{m.name}</Link> ({m.country})</dd>
        <dt>Type</dt><dd>{chocolate.type}</dd>
        <dt>Filling</dt><dd>{chocolate.filling}</dd>
        {chocolate.cocoaPercentage != null && <><dt>Cocoa</dt><dd>{chocolate.cocoaPercentage}%</dd></>}
        {chocolate.weight != null && <><dt>Weight</dt><dd>{chocolate.weight} g</dd></>}
        {chocolate.color && <><dt>Color</dt><dd>{chocolate.color}</dd></>}
      </dl>

      {chocolate.description && <p>{chocolate.description}</p>}

      {isAdmin && (
        <div className="actions">
          <Link to={`/chocolates/${id}/edit`} className="button">Edit</Link>
          <button className="danger" onClick={handleDelete}>Delete</button>
        </div>
      )}
      {actionError && <p className="error">{actionError}</p>}
    </article>
  );
}
