import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Tasks({ token, API, userRole }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${API}/projects`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (Array.isArray(res.data)) {
          setProjects(res.data);
          if (res.data.length > 0) setProjectId(res.data[0]._id);
        }
      }).catch(err => console.error(err));

    axios.get(`${API}/auth/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (Array.isArray(res.data)) setUsers(res.data);
      }).catch(err => console.error(err));

    fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
      if (Array.isArray(res.data)) {
        setTasks(res.data);
      }
    } catch (err) { console.error(err); }
  };

  const createTask = async () => {
    if (!projectId) return alert('Please select or create a project first');
    try {
      await axios.post(`${API}/tasks`, { 
        title, 
        description, 
        project: projectId, 
        assignedTo: assignedTo || undefined,
        deadline: deadline || undefined,
        priority
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTitle('');
      setDescription('');
      setAssignedTo('');
      setDeadline('');
      setPriority('Medium');
      fetchTasks();
    } catch (err) { alert('Failed to create task'); }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`${API}/tasks/${taskId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) { alert('Failed to update task status'); }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`${API}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) { alert('Failed to delete task'); }
  };

  return (
    <div>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Tasks Management</h2>
      
      {userRole === 'Admin' && (
        <div style={{ marginBottom: '30px', padding: '25px', background: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#4e73df' }}>Create New Task (Admin)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <input placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
            <select value={projectId} onChange={e => setProjectId(e.target.value)} style={inputStyle}>
              {Array.isArray(projects) && projects.map(p => <option key={p?._id} value={p?._id}>{p?.name}</option>)}
            </select>
            <input placeholder="Task Description" value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, gridColumn: 'span 2' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Assign To</label>
              <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} style={inputStyle}>
                <option value="">Unassigned</option>
                {Array.isArray(users) && users.map(u => <option key={u?._id} value={u?._id}>{u?.name}</option>)}
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Deadline</label>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={inputStyle} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} style={inputStyle}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <button onClick={createTask} style={{ ...btnStyle, marginTop: '20px', width: '100%' }}>Create Task</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {Array.isArray(tasks) && tasks.map(task => (
          <div key={task._id} style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#333' }}>{task.title}</h3>
              {userRole === 'Admin' && (
                <button onClick={() => deleteTask(task._id)} style={{ background: '#e74a3b', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
              )}
            </div>
            
            <span style={{ 
              display: 'inline-block', width: 'fit-content', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px',
              background: task.status === 'Completed' ? '#d4edda' : task.status === 'In Progress' ? '#cce5ff' : '#fff3cd',
              color: task.status === 'Completed' ? '#155724' : task.status === 'In Progress' ? '#004085' : '#856404'
            }}>
              {task.status}
            </span>
            <span style={{ display: 'inline-block', marginLeft: '10px', width: 'fit-content', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px', background: '#e2e3e5', color: '#333' }}>{task.priority || 'Medium'} Priority</span>

            <p style={{ color: '#555', fontSize: '14px', flexGrow: 1 }}>{task.description || 'No description provided.'}</p>
            
            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee', fontSize: '13px', color: '#888' }}>
              <p style={{ margin: '0 0 5px 0' }}><b>Project:</b> {task?.project?.name || 'Unknown'}</p>
              <p style={{ margin: '0 0 5px 0' }}><b>Assigned To:</b> {task?.assignedTo?.name || 'Unassigned'}</p>
              {task.deadline && <p style={{ margin: '0 0 10px 0', color: new Date(task.deadline) < new Date() && task.status !== 'Completed' ? '#e74a3b' : '#888' }}><b>Deadline:</b> {new Date(task.deadline).toLocaleDateString()}</p>}
              
              {userRole !== 'Admin' ? (
                <select value={task.status} onChange={e => updateStatus(task._id, e.target.value)} style={{ ...inputStyle, width: '100%', padding: '8px', marginTop: '5px' }}>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              ) : (
                <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '12px', fontStyle: 'italic' }}>* Status can only be updated by members</p>
              )}
          </div>
        </div>
      ))}</div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none', boxSizing: 'border-box' };
const btnStyle = { padding: '12px 20px', background: '#4e73df', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default Tasks;