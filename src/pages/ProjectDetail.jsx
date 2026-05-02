import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject } from '../api/projects';
import { getTasks, updateTask, deleteTask } from '../api/tasks';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import AddMemberModal from '../components/AddMemberModal';

const COLUMNS = [
    { key:'TODO',        label:'To Do',       color:'#1e3a5f' },
    { key:'IN_PROGRESS', label:'In Progress',  color:'#3b2a00' },
    { key:'DONE',        label:'Done',         color:'#052e16' },
];

export default function ProjectDetail() {
    const { id: projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject]               = useState(null);
    const [tasks, setTasks]                   = useState([]);
    const [loading, setLoading]               = useState(true);
    const [showTaskModal, setShowTaskModal]   = useState(false);
    const [showMemberModal, setShowMemberModal] = useState(false);

    useEffect(() => { fetchAll(); }, [projectId]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [pRes, tRes] = await Promise.all([getProject(projectId), getTasks(projectId)]);
            setProject(pRes.data);
            setTasks(tRes.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleStatusChange = async (task, newStatus) => {
        try {
            const res = await updateTask(projectId, task.id, {
                title: task.title, description: task.description,
                status: newStatus, priority: task.priority,
                dueDate: task.dueDate, assigneeId: task.assigneeId || null,
            });
            setTasks(prev => prev.map(t => t.id === task.id ? res.data : t));
        } catch (err) { alert(err.response?.data?.error || 'Failed to update'); }
    };

    const handleDeleteTask = async (taskId) => {
        if (!confirm('Delete this task?')) return;
        try {
            await deleteTask(projectId, taskId);
            setTasks(prev => prev.filter(t => t.id !== taskId));
        } catch (err) { alert(err.response?.data?.error || 'Failed to delete'); }
    };

    if (loading) return <div style={{textAlign:'center',padding:'4rem',color:'#64748b'}}>Loading project...</div>;

    return (
        <div style={s.page}>
            <div style={s.header}>
                <div style={{display:'flex',alignItems:'flex-start',gap:16}}>
                    <button onClick={() => navigate('/dashboard')} style={s.backBtn}>← Dashboard</button>
                    <div>
                        <h1 style={s.projectName}>{project?.name}</h1>
                        {project?.description && <p style={s.projectDesc}>{project.description}</p>}
                    </div>
                </div>
                <div style={{display:'flex',gap:10}}>
                    <button onClick={() => setShowMemberModal(true)} style={s.btnGhost}>👥 Add Member</button>
                    <button onClick={() => setShowTaskModal(true)} style={s.btnPrimary}>+ Add Task</button>
                </div>
            </div>

            <div style={s.summary}>
                {COLUMNS.map(col => (
                    <span key={col.key} style={{...s.summaryBadge, borderColor: col.color}}>
            {col.label}: <strong style={{color:'#f1f5f9'}}>{tasks.filter(t=>t.status===col.key).length}</strong>
          </span>
                ))}
                <span style={{...s.summaryBadge,borderColor:'#334155'}}>
          Total: <strong style={{color:'#f1f5f9'}}>{tasks.length}</strong>
        </span>
            </div>

            <div style={s.board}>
                {COLUMNS.map(col => {
                    const colTasks = tasks.filter(t => t.status === col.key);
                    return (
                        <div key={col.key} style={s.column}>
                            <div style={{...s.colHeader, borderBottom:`2px solid ${col.color}`}}>
                                <span style={s.colTitle}>{col.label}</span>
                                <span style={{...s.colCount, background:col.color}}>{colTasks.length}</span>
                            </div>
                            <div style={{display:'flex',flexDirection:'column',gap:10}}>
                                {colTasks.length === 0
                                    ? <p style={s.emptyCol}>No tasks here</p>
                                    : colTasks.map(task => (
                                        <TaskCard key={task.id} task={task}
                                                  onStatusChange={handleStatusChange}
                                                  onDelete={handleDeleteTask}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                    );
                })}
            </div>

            {showTaskModal && (
                <TaskModal
                    projectId={projectId}
                    onClose={() => setShowTaskModal(false)}
                    onCreated={(t) => { setTasks(prev => [...prev, t]); setShowTaskModal(false); }}
                />
            )}
            {showMemberModal && (
                <AddMemberModal
                    projectId={projectId}
                    onClose={() => setShowMemberModal(false)}
                    onAdded={() => alert('Member added!')}
                />
            )}
        </div>
    );
}

const s = {
    page:        { maxWidth:1200, margin:'0 auto', padding:'1.5rem' },
    header:      { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem', flexWrap:'wrap', gap:12 },
    backBtn:     { background:'none', border:'1px solid #334155', borderRadius:6, color:'#94a3b8', cursor:'pointer', fontSize:13, padding:'6px 12px' },
    projectName: { margin:0, fontSize:22, fontWeight:700, color:'#f1f5f9' },
    projectDesc: { margin:'4px 0 0', fontSize:13, color:'#64748b' },
    btnPrimary:  { padding:'9px 18px', background:'#38bdf8', color:'#0f172a', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer' },
    btnGhost:    { padding:'9px 18px', background:'transparent', border:'1px solid #334155', borderRadius:8, fontSize:14, color:'#94a3b8', cursor:'pointer' },
    summary:     { display:'flex', gap:10, marginBottom:'1.5rem', flexWrap:'wrap' },
    summaryBadge:{ fontSize:12, color:'#64748b', padding:'4px 12px', border:'1px solid', borderRadius:20 },
    board:       { display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 },
    column:      { background:'#1e293b', borderRadius:12, padding:'1rem', minHeight:400 },
    colHeader:   { display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:10, marginBottom:12 },
    colTitle:    { fontSize:14, fontWeight:600, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' },
    colCount:    { fontSize:11, fontWeight:700, color:'#fff', padding:'2px 8px', borderRadius:20 },
    emptyCol:    { textAlign:'center', color:'#334155', fontSize:13, padding:'2rem 0' },
};