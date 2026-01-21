import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="container-custom flex-between" style={{ height: '100%' }}>
                {/* LOGO */}
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <div className="flex-center" style={{ gap: '12px' }}>
                        <div style={{
                            width: 32,
                            height: 32,
                            background: '#fff',
                            borderRadius: 8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 20px rgba(255,255,255,0.2)'
                        }}>
                            <div style={{
                                width: 12,
                                height: 12,
                                border: '2px solid black',
                                transform: 'rotate(45deg)'
                            }} />
                        </div>
                        <div className="flex-col">
                            <span style={{ fontSize: 20, fontWeight: '700', color: 'white', letterSpacing: '-0.5px', lineHeight: 1 }}>
                                AleoZKPay
                            </span>
                        </div>
                    </div>
                </Link>

                {/* NAVIGATION */}
                <div className="nav-links">
                    <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Explorer</Link>
                    <Link to="/create" className={`nav-link ${isActive('/create') ? 'active' : ''}`}>Create Invoice</Link>
                    <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>Profile</Link>
                </div>

                {/* CONNECT BUTTON */}
                <button className="btn-connect">
                    <span>Connect Wallet</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
