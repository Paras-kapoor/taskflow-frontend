const PRIORITY_STYLE = {
    HIGH:   { background:'#450a0a', color:'#fca5a5' },
    MEDIUM: { background:'#422006', color:'#fed7aa' },
    LOW:    { background:'#052e16', color:'#86efac' },
};

export default function TaskCard({ task, onStatusChange, onDelete }) {
    const ps = PRIORITY_STYLE[task.priority] || PRIORITY_STYLE.MEDIUM;
    return (
        <div style={s.card}>
            <div style={s.titleRow}>
                <p style={{...s.title, textDecoration:task.status==='DONE'?'line-through':'none', color:task.status==='DONE'?'#475569':'#f1f5f9'}}>
                    {task.title}
                </p>
                <button onClick={() => onDelete(task.id)} style={s.delBtn}>✕</button>
            </div>
            {task.description && <p style={s.desc}>{task.description}</p>}
            {task.overdue && <div style={s.overdue}>⚠ Overdue · {task.dueDate}</div>}
            {task.dueDate && !task.overdue && <p style={s.due}>📅 {task.dueDate}</p>}
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                <span style={{...s.badge, ...ps}}>{task.priority}</span>
                {task.assigneeName && <span style={s.assignee}>👤 {task.assigneeName}</span>}
            </div>
            <select value={task.status} onChange={e => onStatusChange(task, e.target.value)} style={s.select}>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
            </select>
        </div>
    );
}

const s = {
    card:     { background:'#0f172a', borderRadius:10, padding:'0.9rem', border:'1px solid #1e293b', display:'flex', flexDirection:'column' },
    titleRow: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8, marginBottom:4 },
    title:    { margin:0, fontSize:14, fontWeight:600, lineHeight:1.4, flex:1 },
    desc:     { margin:'4px 0 8px', fontSize:12, color:'#64748b', lineHeight:1.5 },
    overdue:  { fontSize:11, color:'#f87171', background:'#450a0a', padding:'3px 8px', borderRadius:4, marginBottom:8 },
    due:      { margin:'0 0 8px', fontSize:11, color:'#64748b' },
    badge:    { fontSize:11, padding:'2px 8px', borderRadius:20, fontWeight:600 },
    assignee: { fontSize:11, color:'#64748b' },
    delBtn:   { background:'none', border:'none', color:'#334155', cursor:'pointer', fontSize:12, padding:2 },
    select:   { width:'100%', padding:'6px 8px', border:'1px solid #1e293b', borderRadius:6, fontSize:12, background:'#1e293b', color:'#94a3b8', cursor:'pointer', marginTop:4 },
};