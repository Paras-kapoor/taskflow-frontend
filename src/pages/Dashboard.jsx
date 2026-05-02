import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjects, createProject, deleteProject } from '../api/projects';
import { getDashboard } from '../api/tasks';

export default function Dashboard() {
    const [projects, setProjects]   = useState([]);
    const [stats, setStats]         = useState(null);
    const [loading, setLoading]     = useState(true);
    const [showForm, setShowForm]   = useState(false);
    const [newName, setNewName]     = useState('');
    const [newDesc, setNewDesc]     = useState('');
    const [creating, setCreating]   = useState(false);
    const [formError, setFormError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [pRes, sRes] = await Promise.all([getProjects(), getDashboard()]);
            setProjects(pRes.data);
            setStats(sRes.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setFormError(''); setCreating(true);
        try {
            const res = await createProject({ name: newName, description: newDesc });
            setProjects(prev => [res.data, ...prev]);
            setNewName(''); setNewDesc(''); setShowForm(false);
        } catch (err) { setFormError(err.response?.data?.error || 'Failed to create'); }
        finally { setCreating(false); }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!confirm('Delete this project and all its tasks?')) return;
        try {
            await deleteProject(id);
            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (err) { alert(err.response?.data?.error || 'Failed to delete'); }
    };

    if (loading) return <div style={{textAlign:'center',padding:'4rem',color:'#64748b'}}>Loading...</div>;

    return (
        <div style={s.page}>
            {stats && (
                <div style={s.statsRow}>
                    {[{label:'Projects',value:stats.totalProjects,color:'#38bdf8'},
                        {label:'Total Tasks',value:stats.totalTasks,color:'#a78bfa'},
                        {label:'Overdue',value:stats.overdueTasks,color:'#f87171'},
                        {label:'Done',value:stats.tasksByStatus?.DONE||0,color:'#34d399'},
                    ].map(s2 => (
                        <div key={s2.label} style={{background:'#1e293b',border:'1px solid #334155',borderRadius:12,padding:'1rem 1.25rem',flex:1,minWidth:120}}>
                            <p style={{margin:0,fontSize:28,fontWeight:700,color:s2.color}}>{s2.value}</p>
                            <p style={{margin:'4px 0 0',fontSize:13,color:'#64748b'}}>{s2.label}</p>
                        </div>
                    ))}
                </div>
            )}

            <div style={s.header}>
                <div>
                    <h2 style={s.h2}>My Projects</h2>
                    <p style={s.sub}>{projects.length} project{projects.length!==1?'s':''} total</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} style={s.btnPrimary}>
                    {showForm ? 'Cancel' : '+ New Project'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} style={s.createForm}>
                    <h3 style={{margin:'0 0 1rem',color:'#f1f5f9',fontSize:16}}>New Project</h3>
                    {formError && <div style={s.errBox}>{formError}</div>}
                    <input placeholder="Project name *" value={newName} onChange={e=>setNewName(e.target.value)} required style={s.input}/>
                    <input placeholder="Description (optional)" value={newDesc} onChange={e=>setNewDesc(e.target.value)} style={s.input}/>
                    <button type="submit" disabled={creating} style={s.btnPrimary}>{creating?'Creating...':'Create Project'}</button>
                </form>
            )}

            {projects.length === 0 ? (
                <div style={{textAlign:'center',padding:'5rem',color:'#64748b'}}>No projects yet. Create your first one!</div>
            ) : (
                <div style={s.grid}>
                    {projects.map(p => (
                        <div key={p.id} style={s.card} onClick={() => navigate(`/projects/${p.id}`)}>
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                                <h3 style={s.cardTitle}>{p.name}</h3>
                                <button onClick={e=>handleDelete(e,p.id)} style={s.delBtn}>✕</button>
                            </div>
                            {p.description && <p style={s.cardDesc}>{p.description}</p>}
                            <div style={{display:'flex',gap:8,marginBottom:10}}>
                                <span style={s.badge1}>{p.taskCount} tasks</span>
                                <span style={s.badge2}>{p.memberCount} members</span>
                            </div>
                            <p style={s.cardOwner}>Owner: {p.ownerName}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const s = {
    page:      { maxWidth:1100, margin:'0 auto', padding:'2rem 1.5rem' },
    statsRow:  { display:'flex', gap:12, marginBottom:'2rem', flexWrap:'wrap' },
    header:    { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' },
    h2:        { margin:0, fontSize:22, fontWeight:700, color:'#f1f5f9' },
    sub:       { margin:'4px 0 0', color:'#64748b', fontSize:13 },
    grid:      { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16 },
    card:      { background:'#1e293b', border:'1px solid #334155', borderRadius:12, padding:'1.25rem', cursor:'pointer' },
    cardTitle: { margin:0, fontSize:16, fontWeight:600, color:'#f1f5f9' },
    cardDesc:  { margin:'8px 0 12px', fontSize:13, color:'#64748b', lineHeight:1.5 },
    badge1:    { fontSize:12, padding:'3px 10px', borderRadius:20, fontWeight:500, background:'#1e3a5f', color:'#7dd3fc' },
    badge2:    { fontSize:12, padding:'3px 10px', borderRadius:20, fontWeight:500, background:'#1e2d40', color:'#94a3b8' },
    cardOwner: { margin:0, fontSize:12, color:'#475569' },
    delBtn:    { background:'none', border:'none', color:'#475569', cursor:'pointer', fontSize:13, padding:'2px 4px' },
    createForm:{ background:'#1e293b', border:'1px solid #334155', borderRadius:12, padding:'1.5rem', marginBottom:'1.5rem', display:'flex', flexDirection:'column', gap:12 },
    input:     { padding:'10px 14px', background:'#0f172a', border:'1px solid #334155', borderRadius:8, fontSize:14, color:'#f1f5f9', outline:'none' },
    btnPrimary:{ padding:'10px 20px', background:'#38bdf8', color:'#0f172a', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer' },
    errBox:    { background:'#450a0a', border:'1px solid #7f1d1d', color:'#fca5a5', borderRadius:8, padding:'10px 14px', fontSize:13 },
};