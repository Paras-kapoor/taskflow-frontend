import { useState } from 'react';
import { addMember } from '../api/projects';

export default function AddMemberModal({ projectId, onClose, onAdded }) {
    const [userId, setUserId]   = useState('');
    const [role, setRole]       = useState('MEMBER');
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await addMember(projectId, { userId: Number(userId), role });
            onAdded();
            onClose();
        } catch (err) { setError(err.response?.data?.error || 'Failed to add member'); }
        finally { setLoading(false); }
    };

    return (
        <div onClick={onClose} style={s.overlay}>
            <div onClick={e => e.stopPropagation()} style={s.modal}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem'}}>
                    <h3 style={{margin:0,fontSize:18,fontWeight:700,color:'#f1f5f9'}}>Add Member</h3>
                    <button onClick={onClose} style={{background:'none',border:'none',color:'#64748b',cursor:'pointer',fontSize:16}}>✕</button>
                </div>
                {error && <div style={s.err}>{error}</div>}
                <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>
                    <div style={s.field}>
                        <label style={s.label}>User ID</label>
                        <input type="number" value={userId} onChange={e=>setUserId(e.target.value)} required placeholder="Enter user's numeric ID" style={s.input}/>
                    </div>
                    <div style={s.field}>
                        <label style={s.label}>Role</label>
                        <select value={role} onChange={e=>setRole(e.target.value)} style={s.input}>
                            <option value="MEMBER">Member</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <div style={{display:'flex',justifyContent:'flex-end',gap:10}}>
                        <button type="button" onClick={onClose} style={s.ghost}>Cancel</button>
                        <button type="submit" disabled={loading} style={s.primary}>{loading?'Adding...':'Add Member'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const s = {
    overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'1rem' },
    modal:   { background:'#1e293b', border:'1px solid #334155', borderRadius:16, padding:'1.75rem', width:'100%', maxWidth:420 },
    field:   { display:'flex', flexDirection:'column', gap:5 },
    label:   { fontSize:12, fontWeight:500, color:'#94a3b8' },
    input:   { padding:'9px 12px', background:'#0f172a', border:'1px solid #334155', borderRadius:8, fontSize:14, color:'#f1f5f9', outline:'none' },
    err:     { background:'#450a0a', border:'1px solid #7f1d1d', color:'#fca5a5', borderRadius:8, padding:'10px 14px', fontSize:13, marginBottom:8 },
    primary: { padding:'9px 22px', background:'#38bdf8', color:'#0f172a', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer' },
    ghost:   { padding:'9px 22px', background:'transparent', border:'1px solid #334155', borderRadius:8, fontSize:14, color:'#94a3b8', cursor:'pointer' },
};