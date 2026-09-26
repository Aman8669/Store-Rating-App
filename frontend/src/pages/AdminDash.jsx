import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const AdminDash = () => {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [users, setUsers] = useState([]);
  const [storeName, setStoreName] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await API.get('/admin/stats');
      setStats(statsRes.data);

      const usersRes = await API.get('/admin/users');
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/create-store', {
        name: storeName,
        email: storeEmail,
        address: storeAddress,
        ownerId: ownerId || null,
      });
      setMsg('✅ Store Created Successfully!');
      setStoreName('');
      setStoreEmail('');
      setStoreAddress('');
      setOwnerId('');
      fetchData();
    } catch (err) {
      setMsg(err.response?.data?.message || '❌ Failed to create store');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>System Admin Dashboard</h2>
        <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '30px' }}>
        <div style={{ background: '#e3f2fd', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Total Users</h3>
          <h2>{stats.users}</h2>
        </div>
        <div style={{ background: '#e8f5e9', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Total Stores</h3>
          <h2>{stats.stores}</h2>
        </div>
        <div style={{ background: '#fff3e0', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Total Ratings</h3>
          <h2>{stats.ratings}</h2>
        </div>
      </div>

      {/* Add Store Form */}
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Add New Store</h3>
        {msg && <p style={{ fontWeight: 'bold' }}>{msg}</p>}
        <form onSubmit={handleAddStore} style={{ display: 'grid', gap: '12px' }}>
          <input type="text" placeholder="Store Name" value={storeName} onChange={(e) => setStoreName(e.target.value)} required style={{ padding: '8px' }} />
          <input type="email" placeholder="Store Email" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} required style={{ padding: '8px' }} />
          <input type="text" placeholder="Store Address" value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} required style={{ padding: '8px' }} />
          <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)} style={{ padding: '8px' }}>
            <option value="">Select Store Owner (Optional)</option>
            {users.filter(u => u.role === 'STORE_OWNER').map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </select>
          <button type="submit" style={{ padding: '10px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Store</button>
        </form>
      </div>
    </div>
  );
};

export default AdminDash;