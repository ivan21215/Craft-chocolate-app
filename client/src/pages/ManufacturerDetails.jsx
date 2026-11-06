import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import ChocolateCard from '../components/ChocolateCard';

export default function ManufacturerDetails() {
  const { id } = useParams();
  const [manufacturer, setManufacturer] = useState(null);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    api.get(`/manufacturers/${id}`)
      .then(res => setManufacturer(res.data))
      .catch(err => setError(err.response?.data?.message || 'Could not load manufacturer'));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${manufacturer.name}"?`)) return;
    try {
      await api.delete(`/manufacturers/${id}`);
      navigate('/manufacturers');
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not delete manufacturer');
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!manufacturer) return <p>Loading...</p>;

  return (
    <article className="details">
      <Link to="/manufacturers">← Back to manufacturers</Link>
      {manufacturer.logoUrl && <img src={manufacturer.logoUrl} alt={manufacturer.name} className="logo" />}
      <h1>{manufacturer.name}</h1>

      <dl>
        <dt>Country</dt><dd>{manufacturer.country}</dd>
        {manufacturer.foundedYear && <><dt>Founded</dt><dd>{manufacturer.foundedYear}</dd></>}
      </dl>
      {manufacturer.description && <p>{manufacturer.description}</p>}

      {isAdmin && (
        <div className="actions">
          <Link to={`/manufacturers/${id}/edit`} className="button">Edit</Link>
          <button className="danger" onClick={handleDelete}>Delete</button>
        </div>
      )}
      {actionError && <p className="error">{actionError}</p>}

      <h2>Chocolates ({manufacturer.chocolates.length})</h2>
      {manufacturer.chocolates.length === 0
        ? <p className="muted">No chocolates from this manufacturer.</p>
        : (
          <div className="grid">
            {manufacturer.chocolates.map(c => <ChocolateCard key={c._id} chocolate={c} />)}
          </div>
        )}
    </article>
  );
}
