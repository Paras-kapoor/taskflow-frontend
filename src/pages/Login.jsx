import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/auth';

export default function Login() {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);
    const { login } = useAuth();
    const navigate  = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const res = await loginUser({ email, password });
            login(res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally { setLoading(false); }
    };

    return (
        <div style={s.page}>
            <div style={s.card}>
                <h1 style={s.title}>Welcome back</h1>
                <p style={s.sub}>Sign in to your account</p>
                {error && <div style={s.err}>{error}</div>}
                <form onSubmit={handleSubmit} style={s.form}>
                    <label style={s.label}>Email</label>
                    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com" style={s.input}/>
                    <label style={s.label}>Password</label>
                    <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" style={s.input}/>
                    <button type="submit" disabled={loading} style={s.btn}>{loading?'Signing in...':'Sign in'}</button>
                </form>
                <p style={s.foot}>No account? <Link to="/register" style={s.link}>Create one</Link></p>
            </div>
        </div>
    );
}

const s = {
    page:  { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a' },
    card:  { background:'#1e293b', border:'1px solid #334155', borderRadius:16, padding:'2.5rem 2rem', width:'100%', maxWidth:400 },
    title: { margin:0, fontSize:26, fontWeight:700, color:'#f1f5f9' },
    sub:   { margin:'6px 0 1.75rem', fontSize:14, color:'#64748b' },
    form:  { display:'flex', flexDirection:'column', gap:12 },
    label: { fontSize:13, fontWeight:500, color:'#94a3b8' },
    input: { padding:'10px 14px', background:'#0f172a', border:'1px solid #334155', borderRadius:8, fontSize:14, color:'#f1f5f9', outline:'none' },
    btn:   { marginTop:4, padding:11, background:'#38bdf8', color:'#0f172a', border:'none', borderRadius:8, fontSize:15, fontWeight:700, cursor:'pointer' },
    err:   { background:'#450a0a', border:'1px solid #7f1d1d', color:'#fca5a5', borderRadius:8, padding:'10px 14px', fontSize:13, marginBottom:12 },
    foot:  { textAlign:'center', marginTop:'1.5rem', fontSize:13, color:'#64748b' },
    link:  { color:'#38bdf8', textDecoration:'none', fontWeight:500 },
};