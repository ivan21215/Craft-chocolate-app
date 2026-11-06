import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const TYPES = ['dark', 'milk', 'white'];
const FILLINGS = ['none', 'strawberry', 'cookie', 'hazelnut', 'almond', 'caramel', 'orange', 'mint', 'sea salt'];

const emptyForm = {
  name: '',
  manufacturer: '',
  type: 'dark',
  filling: 'none',
  cocoaPercentage: '',
  price: '',
  weight: '',
  color: '',
  description: '',
  imageUrl: ''
};

export default function ChocolateForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [manufacturers, setManufacturers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/manufacturers').then(res => setManufacturers(res.data));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/chocolates/${id}`).then(res => {
      const c = res.data;
      setForm({
        name: c.name,
        manufacturer: c.manufacturer._id,
        type: c.type,
        filling: c.filling,
        cocoaPercentage: c.cocoaPercentage ?? '',
        price: c.price,
        weight: c.weight ?? '',
        color: c.color ?? '',
        description: c.description ?? '',
        imageUrl: c.imageUrl ?? ''
      });
    });
  }, [id, isEdit]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    const data = {
      ...form,
      price: Number(form.price),
      cocoaPercentage: form.cocoaPercentage === '' ? null : Number(form.cocoaPercentage),
      weight: form.weight === '' ? null : Number(form.weight)
    };

    try {
      const res = isEdit
        ? await api.put(`/chocolates/${id}`, data)
        : await api.post('/chocolates', data);
      navigate(`/chocolates/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save chocolate');
    }
  };

  return (
    <form className="form wide" onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Edit chocolate' : 'New chocolate'}</h2>
      {error && <p className="error">{error}</p>}

      <label>
        Name
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>

      <label>
        Manufacturer
        <select name="manufacturer" value={form.manufacturer} onChange={handleChange} required>
          <option value="">Select manufacturer</option>
          {manufacturers.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
        </select>
      </label>

      <div className="row">
        <label>
          Type
          <select name="type" value={form.type} onChange={handleChange}>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label>
          Filling
          <select name="filling" value={form.filling} onChange={handleChange}>
            {FILLINGS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </label>
      </div>

      <div className="row">
        <label>
          Price (€)
          <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required />
        </label>
        <label>
          Cocoa (%)
          <input name="cocoaPercentage" type="number" min="0" max="100" value={form.cocoaPercentage} onChange={handleChange} />
        </label>
        <label>
          Weight (g)
          <input name="weight" type="number" min="0" value={form.weight} onChange={handleChange} />
        </label>
      </div>

      <label>
        Color
        <input name="color" value={form.color} onChange={handleChange} />
      </label>

      <label>
        Image URL
        <input name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange} />
      </label>

      <label>
        Description
        <textarea name="description" rows="3" value={form.description} onChange={handleChange} />
      </label>

      <div className="actions">
        <button type="submit">{isEdit ? 'Save changes' : 'Create chocolate'}</button>
        <Link to={isEdit ? `/chocolates/${id}` : '/'}>Cancel</Link>
      </div>
    </form>
  );
}
