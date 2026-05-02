import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (!user || ['/login', '/register'].includes(location.pathname)) return null;

    return (
        <nav style={s.nav}>
            <span onClick={() => navigate('/dashboard')} style={s.logo}>⚡ TaskFlow</span>
            <div style={s.right}>
                <div style={s.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
                <span style={s.name}>{user?.name}</span>
                <button onClick={() => { logout(); navigate('/login'); }} style={s.btn}>Logout</button>
            </div>
        </nav>
    );
}

const s = {
    nav:    { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0 1.5rem', height:58, background:'#0f172a', borderBottom:'1px solid #1e293b', position:'sticky', top:0, zIndex:100 },
    logo:   { fontSize:18, fontWeight:700, color:'#38bdf8', cursor:'pointer' },
    right:  { display:'flex', alignItems:'center', gap:12 },
    avatar: { width:32, height:32, borderRadius:'50%', background:'#38bdf8', color:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14 },
    name:   { fontSize:14, color:'#94a3b8' },
    btn:    { padding:'6px 14px', background:'transparent', border:'1px solid #334155', borderRadius:6, fontSize:13, color:'#94a3b8', cursor:'pointer' },
};