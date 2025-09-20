import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  const fetchSubmissions = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/submissions');
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleAdd = () => navigate('/fake-news-detection');

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    try {
      const response = await fetch(`http://localhost:5000/admin/delete/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        setSubmissions(submissions.filter(sub => sub._id !== id));
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  if (loading) return <div className="admin-loading">Loading submissions...</div>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>
      {submissions.length === 0 ? (
        <p className="admin-empty">No submissions found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Content</th>
              <th>Prediction</th>
              <th>Probability</th>
              <th>Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(sub => (
              <tr key={sub._id}>
                <td>{sub.title || '-'}</td>
                <td>{sub.content}</td>
                <td>{sub.prediction === 1 ? 'Real' : 'Fake'}</td>
                <td>{(sub.probability * 100).toFixed(2)}%</td>
                <td>{new Date(sub.timestamp).toLocaleString()}</td>
                <td>
                  <div className="admin-actions">
                  <button className="admin-btn delete" onClick={() => handleDelete(sub._id)}>Delete</button>
                  <button className="admin-btn add" onClick={handleAdd}>Add</button>
                </div>
              </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
