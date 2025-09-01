import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate()

  // Fetch all submissions from backend
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
  const handleAdd=async()=>{
    try{
       navigate('/fake-news-detection')
    }
    catch(e){
        console.log(e)
    }
  }

  // Delete a submission
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;

    try {
      const response = await fetch(`http://localhost:5000/admin/delete/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        // Remove deleted submission from state
        setSubmissions(submissions.filter(sub => sub._id !== id));
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  if (loading) return <div>Loading submissions...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
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
                  <button onClick={() => handleDelete(sub._id)}>Delete</button>
                  <button onClick={() => handleAdd()}>Add</button>
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
