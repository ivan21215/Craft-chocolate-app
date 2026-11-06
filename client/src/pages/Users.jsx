import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const { user: me } = useAuth();

  useEffect(() => {
    api.get('/users').then(res => setUsers(res.data));
  }, []);

  const changeRole = async (id, role) => {
    setError('');
    try {
      const res = await api.put(`/users/${id}/role`, { role });
      setUsers(users.map(u => (u._id === id ? res.data : u)));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not change role');
    }
  };

  const deleteUser = async u => {
    if (!window.confirm(`Delete user "${u.username}"?`)) return;
    setError('');
    try {
      await api.delete(`/users/${u._id}`);
      setUsers(users.filter(x => x._id !== u._id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete user');
    }
  };

  return (
    <>
      <h1>Users</h1>
      {error && <p className="error">{error}</p>}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const isMe = u._id === me.id;
              return (
                <tr key={u._id}>
                  <td>{u.username}{isMe && ' (you)'}</td>
                  <td>{u.email}</td>
                  <td>
                    <select value={u.role} onChange={e => changeRole(u._id, e.target.value)} disabled={isMe}>
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td>
                    {!isMe && <button className="danger" onClick={() => deleteUser(u)}>Delete</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
