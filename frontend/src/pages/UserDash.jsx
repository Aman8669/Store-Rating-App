import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const UserDash = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await API.get('/user/stores');
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRatingSubmit = async (storeId, rating) => {
    try {
      await API.post('/user/ratings', { storeId, rating: Number(rating) });
      fetchStores(); // Update listing
    } catch (err) {
      alert('Failed to submit rating');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>User Dashboard - Stores Listing</h2>
        <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
      </div>

      <input
        type="text"
        placeholder="Search stores by Name or Address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '12px' }}>Store Name</th>
            <th style={{ padding: '12px' }}>Address</th>
            <th style={{ padding: '12px' }}>Overall Rating</th>
            <th style={{ padding: '12px' }}>Your Submitted Rating / Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStores.map((store) => (
            <tr key={store.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{store.name}</td>
              <td style={{ padding: '12px' }}>{store.address}</td>
              <td style={{ padding: '12px' }}>{store.overallRating} ★</td>
              <td style={{ padding: '12px' }}>
                <select
                  value={store.userRating || 0}
                  onChange={(e) => handleRatingSubmit(store.id, e.target.value)}
                  style={{ padding: '6px', borderRadius: '4px' }}
                >
                  <option value={0}>Rate this Store</option>
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
              </td>
            </tr>
          ))}
          {filteredStores.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No stores found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserDash;