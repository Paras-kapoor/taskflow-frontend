import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api/auth';

export default function Register() {
    const [form, setForm]       = useState({ name:'', email:'', password:'' });
    const [error, setError]     = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate  = useNavigate();

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
        setError(''); setLoading(true);
        try {
            const res = await registerUser(form);
            login(res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally { setLoading(false); }
    };

    return (
        <div style={s.page}>
            <div style={s.card}>
                <h1 style={s.title}>Create account</h1>
                <p style={s.sub}>Start managing your projects</p>
                {error && <div style={s.err}>{error}</div>}
                <form onSubmit={handleSubmit} style={s.form}>
                    {[{label:'Full name', name:'name', type:'text', ph:'John Doe'},
                        {label:'Email', name:'email', type:'email', ph:'you@example.com'},
                        {label:'Password', name:'password', type:'password', ph:'Min. 8 characters'}
                    ].map(f => (
                        <div key={f.name} style={{display:'flex',flexDirection:'column',gap:5}}>
                            <label style={s.label}>{f.label}</label>
                            <input name={f.name} type={f.type} value={form[f.name]} onChange={handleChange} required placeholder={f.ph} style={s.input}/>
                        </div>
                    ))}
                    <button type="submit" disabled={loading} style={s.btn}>{loading?'Creating...':'Create account'}</button>
                </form>
                <p style={s.foot}>Already have an account? <Link to="/login" style={s.link}>Sign in</Link></p>
            </div>
        </div>
    );
}

const s = {
    page:  { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a' },
    card:  { background:'#1e293b', border:'1px solid #334155', borderRadius:16, padding:'2.5rem 2rem', width:'100%', maxWidth:400 },
    title: { margin:0, fontSize:26, fontWeight:700, color:'#f1f5f9' },
    sub:   { margin:'6px 0 1.75rem', fontSize:14, color:'#64748b' },
    form:  { display:'flex', flexDirection:'column', gap:14 },
    label: { fontSize:13, fontWeight:500, color:'#94a3b8' },
    input: { padding:'10px 14px', background:'#0f172a', border:'1px solid #334155', borderRadius:8, fontSize:14, color:'#f1f5f9', outline:'none' },
    btn:   { marginTop:4, padding:11, background:'#38bdf8', color:'#0f172a', border:'none', borderRadius:8, fontSize:15, fontWeight:700, cursor:'pointer' },
    err:   { background:'#450a0a', border:'1px solid #7f1d1d', color:'#fca5a5', borderRadius:8, padding:'10px 14px', fontSize:13, marginBottom:4 },
    foot:  { textAlign:'center', marginTop:'1.5rem', fontSize:13, color:'#64748b' },
    link:  { color:'#38bdf8', textDecoration:'none', fontWeight:500 },
};