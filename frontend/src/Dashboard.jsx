import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard({ token, API }) {
  const [dashboard, setDashboard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${API}/tasks/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboard(res.data);
    } catch (err) {
      console.error(err);
      setDashboard({ error: err.response?.data?.message || err.message });
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
      if (Array.isArray(res.data)) setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchDashboard();
    fetchTasks();
  }, [token]);

  if (dashboard && dashboard.error) return <p style={{ fontSize: '18px', color: '#e74a3b', padding: '20px' }}>{dashboard.error}</p>;
  if (!dashboard || typeof dashboard !== 'object' || dashboard.total === undefined) return <p style={{ fontSize: '18px', color: '#666' }}>Loading dashboard...</p>;

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Completed') return t.status === 'Completed';
    if (filter === 'Pending') return t.status === 'Pending';
    if (filter === 'In Progress') return t.status === 'In Progress';
    return true;
  });

  return (
    <div>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Dashboard Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {dashboard.totalProjects !== undefined && (
          <div style={{ ...cardStyle, borderLeft: '5px solid #36b9cc' }}>
            <h4 style={{ color: '#36b9cc', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Total Projects</h4>
            <h2 style={{ margin: 0, fontSize: '32px', color: '#333' }}>{dashboard.totalProjects}</h2>
          </div>
        )}
        <div style={{ ...cardStyle, borderLeft: '5px solid #4e73df' }}>
          <h4 style={{ color: '#4e73df', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Total Tasks</h4>
          <h2 style={{ margin: 0, fontSize: '32px', color: '#333' }}>{dashboard.total}</h2>
        </div>
        <div style={{ ...cardStyle, borderLeft: '5px solid #1cc88a' }}>
          <h4 style={{ color: '#1cc88a', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Completed</h4>
          <h2 style={{ margin: 0, fontSize: '32px', color: '#333' }}>{dashboard.completed}</h2>
        </div>
        <div style={{ ...cardStyle, borderLeft: '5px solid #f6c23e' }}>
          <h4 style={{ color: '#f6c23e', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Pending</h4>
          <h2 style={{ margin: 0, fontSize: '32px', color: '#333' }}>{dashboard.pending}</h2>
        </div>
        <div style={{ ...cardStyle, borderLeft: '5px solid #6f42c1' }}>
          <h4 style={{ color: '#6f42c1', margin: '0 0 10px 0', textTransform: 'uppercase' }}>In Progress</h4>
          <h2 style={{ margin: 0, fontSize: '32px', color: '#333' }}>{dashboard.inProgress}</h2>
        </div>
      </div>

      <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#333' }}>Task List</h3>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '8px 15px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' }}>
            <option value="All">All Tasks</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {filteredTasks.length === 0 ? (
          <p style={{ color: '#888' }}>No tasks found for this filter.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredTasks.map(task => (
              <div key={task._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #e3e6f0', borderRadius: '8px', background: '#fdfdfd' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{task.title}</h4>
                  <small style={{ color: '#888' }}>Project: {task?.project?.name || 'Unknown'} | Assigned to: {task?.assignedTo?.name || 'Unassigned'}</small>
                </div>
                <span style={{ 
                  padding: '5px 12px', 
                  borderRadius: '20px', 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  background: task.status === 'Completed' ? '#d4edda' : task.status === 'In Progress' ? '#cce5ff' : '#fff3cd',
                  color: task.status === 'Completed' ? '#155724' : task.status === 'In Progress' ? '#004085' : '#856404'
                }}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const cardStyle = { padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };

export default Dashboard;