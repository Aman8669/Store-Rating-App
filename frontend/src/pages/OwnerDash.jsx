import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const OwnerDash = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyStore();
  }, []);

  const fetchMyStore = async () => {
    try {
      const res = await API.get('/owner/my-store');
      setStore(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch store details');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading dashboard...</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Store Owner Dashboard</h2>
        <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {error && <div style={{ color: '#d32f2f', background: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

      {store ? (
        <>
          <h3 style={{ marginBottom: '15px' }}>Store: {store.name} ({store.address})</h3>

          {/* Stats Cards */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
            <div style={{ background: '#e3f2fd', padding: '16px 24px', borderRadius: '8px' }}>
              <p style={{ margin: 0, color: '#555' }}>Average Rating</p>
              <h2 style={{ margin: '8px 0 0' }}>{store.averageRating} / 5.0 ★</h2>
            </div>
            <div style={{ background: '#f1f8e9', padding: '16px 24px', borderRadius: '8px' }}>
              <p style={{ margin: 0, color: '#555' }}>Total Submitted Ratings</p>
              <h2 style={{ margin: '8px 0 0' }}>{store.totalRatingsCount}</h2>
            </div>
          </div>

          {/* Ratings Table */}
          <h3>Users Who Rated Your Store</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px' }}>User Name</th>
                <th style={{ padding: '12px' }}>User Email</th>
                <th style={{ padding: '12px' }}>Submitted Rating</th>
              </tr>
            </thead>
            <tbody>
              {store.ratings && store.ratings.length > 0 ? (
                store.ratings.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{r.user?.name || 'Anonymous'}</td>
                    <td style={{ padding: '12px' }}>{r.user?.email || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>{r.ratingValue} ★</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>No ratings submitted yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      ) : (
        !error && <p>No store assigned to your account yet.</p>
      )}
    </div>
  );
};

export default OwnerDash;