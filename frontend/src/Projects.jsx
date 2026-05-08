import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Projects({ token, API, userRole }) {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(res.data)) {
        setProjects(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createProject = async () => {
    try {
      await axios.post(`${API}/projects`, { name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName('');
      fetchProjects();
    } catch (err) {
      alert('Failed to create project (Admin Only)');
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await axios.delete(`${API}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
    } catch (err) {
      alert('Failed to delete project (Admin Only)');
    }
  };

  useEffect(() => { 
    fetchProjects(); 
  }, [token]);

  return (
    <div>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Projects Management</h2>
      
      {userRole === 'Admin' && (
        <div style={{ marginBottom: '30px', padding: '25px', background: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#4e73df' }}>Create New Project</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input placeholder="Project Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            <button onClick={createProject} style={btnStyle}>Create Project</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {Array.isArray(projects) && projects.map(proj => (
          <div key={proj._id} style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: '4px solid #4e73df', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#333' }}>{proj.name}</h3>
              {userRole === 'Admin' && (
                <button onClick={() => deleteProject(proj._id)} style={{ background: '#e74a3b', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Delete</button>
              )}
            </div>
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee', fontSize: '13px', color: '#888' }}>
              <p style={{ margin: '0 0 5px 0' }}><b>Created By:</b> {proj?.createdBy?.name || 'Unknown'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = { flex: 1, minWidth: '200px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' };
const btnStyle = { padding: '12px 20px', background: '#4e73df', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', height: 'fit-content' };

export default Projects;