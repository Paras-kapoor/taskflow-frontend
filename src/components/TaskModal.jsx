import { useState } from 'react';
import { createTask } from '../api/tasks';

export default function TaskModal({ projectId, onClose, onCreated }) {
    const [form, setForm]       = useState({ title:'', description:'', priority:'MEDIUM', status:'TODO', dueDate:'', assigneeId:'' });
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const res = await createTask(projectId, {
                title:       form.title,
                description: form.description || null,
                priority:    form.priority,
                status:      form.status,
                dueDate:     form.dueDate || null,
                assigneeId:  form.assigneeId ? Number(form.assigneeId) : null,
            });
            onCreated(res.data);
        } catch (err) { setError(err.response?.data?.error || 'Failed to create task'); }
        finally { setLoading(false); }
    };

    return (
        <div onClick={onClose} style={s.overlay}>
            <div onClick={e => e.stopPropagation()} style={s.modal}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem'}}>
                    <h3 style={{margin:0,fontSize:18,fontWeight:700,color:'#f1f5f9'}}>New Task</h3>
                    <button onClick={onClose} style={{background:'none',border:'none',color:'#64748b',cursor:'pointer',fontSize:16}}>✕</button>
                </div>
                {error && <div style={s.err}>{error}</div>}
                <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>
                    <div style={s.field}>
                        <label style={s.label}>Title *</label>
                        <input name="title" value={form.title} onChange={handleChange} required placeholder="What needs to be done?" style={s.input}/>
                    </div>
                    <div style={s.field}>
                        <label style={s.label}>Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Optional..." style={{...s.input,height:70,resize:'vertical'}}/>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                        <div style={s.field}>
                            <label style={s.label}>Priority</label>
                            <select name="priority" value={form.priority} onChange={handleChange} style={s.input}>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Status</label>
                            <select name="status" value={form.status} onChange={handleChange} style={s.input}>
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                            </select>
                        </div>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                        <div style={s.field}>
                            <label style={s.label}>Due Date</label>
                            <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} style={s.input}/>
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Assignee ID</label>
                            <input name="assigneeId" type="number" value={form.assigneeId} onChange={handleChange} placeholder="Optional" style={s.input}/>
                        </div>
                    </div>
                    <div style={{display:'flex',justifyContent:'flex-end',gap:10,marginTop:4}}>
                        <button type="button" onClick={onClose} style={s.ghost}>Cancel</button>
                        <button type="submit" disabled={loading} style={s.primary}>{loading?'Creating...':'Create Task'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const s = {
    overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'1rem' },
    modal:   { background:'#1e293b', border:'1px solid #334155', borderRadius:16, padding:'1.75rem', width:'100%', maxWidth:500, maxHeight:'90vh', overflowY:'auto' },
    field:   { display:'flex', flexDirection:'column', gap:5 },
    label:   { fontSize:12, fontWeight:500, color:'#94a3b8' },
    input:   { padding:'9px 12px', background:'#0f172a', border:'1px solid #334155', borderRadius:8, fontSize:14, color:'#f1f5f9', outline:'none', width:'100%', boxSizing:'border-box' },
    err:     { background:'#450a0a', border:'1px solid #7f1d1d', color:'#fca5a5', borderRadius:8, padding:'10px 14px', fontSize:13, marginBottom:8 },
    primary: { padding:'9px 22px', background:'#38bdf8', color:'#0f172a', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer' },
    ghost:   { padding:'9px 22px', background:'transparent', border:'1px solid #334155', borderRadius:8, fontSize:14, color:'#94a3b8', cursor:'pointer' },
};