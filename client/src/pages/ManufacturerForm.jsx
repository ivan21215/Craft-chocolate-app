import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const emptyForm = { name: '', country: '', foundedYear: '', description: '', logoUrl: '' };

export default function ManufacturerForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/manufacturers/${id}`).then(res => {
      const m = res.data;
      setForm({
        name: m.name,
        country: m.country,
        foundedYear: m.foundedYear ?? '',
        description: m.description ?? '',
        logoUrl: m.logoUrl ?? ''
      });
    });
  }, [id, isEdit]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    const data = { ...form, foundedYear: form.foundedYear === '' ? null : Number(form.foundedYear) };

    try {
      const res = isEdit
        ? await api.put(`/manufacturers/${id}`, data)
        : await api.post('/manufacturers', data);
      navigate(`/manufacturers/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save manufacturer');
    }
  };

  return (
    <form className="form wide" onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Edit manufacturer' : 'New manufacturer'}</h2>
      {error && <p className="error">{error}</p>}

      <label>
        Name
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>

      <div className="row">
        <label>
          Country
          <input name="country" value={form.country} onChange={handleChange} required />
        </label>
        <label>
          Founded
          <input name="foundedYear" type="number" min="1500" max={new Date().getFullYear()} value={form.foundedYear} onChange={handleChange} />
        </label>
      </div>

      <label>
        Logo URL
        <input name="logoUrl" type="url" value={form.logoUrl} onChange={handleChange} />
      </label>

      <label>
        Description
        <textarea name="description" rows="3" value={form.description} onChange={handleChange} />
      </label>

      <div className="actions">
        <button type="submit">{isEdit ? 'Save changes' : 'Create manufacturer'}</button>
        <Link to={isEdit ? `/manufacturers/${id}` : '/manufacturers'}>Cancel</Link>
      </div>
    </form>
  );
}
