import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="container-custom flex-between" style={{ height: '100%' }}>
                {/* LOGO */}
                <div className="flex-center" style={{ gap: '14px' }}>
                    <div style={{
                        width: 42,
                        height: 42,
                        background: 'linear-gradient(135deg, #00ff88, #00d4aa)',
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '900',
                        fontSize: 24,
                        color: 'black',
                        boxShadow: '0 0 15px rgba(0,255,136,0.3)'
                    }}>
                        ⚡
                    </div>
                    <span style={{ fontSize: 26, fontWeight: '800', color: 'white', letterSpacing: '-0.5px' }}>
                        Aleo<span style={{ color: '#00ff88' }}>ZK</span>Pay
                    </span>
                </div>

                {/* NAVIGATION */}
                <div className="nav-links">
                    <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Explorer</Link>
                    <Link to="/create" className={`nav-link ${isActive('/create') ? 'active' : ''}`}>Create Invoice</Link>
                    <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>Profile</Link>
                </div>

                {/* CONNECT BUTTON */}
                <button className="btn-connect">
                    <span>Connect Wallet</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                        <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
