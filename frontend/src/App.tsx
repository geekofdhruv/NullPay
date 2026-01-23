import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Explorer from './pages/Explorer';
import CreateInvoice from './pages/CreateInvoice';
import PaymentPage from './pages/PaymentPage';
import Profile from './pages/Profile';
import InvoiceDetails from './pages/InvoiceDetails';
import './index.css';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-bg-black">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<Explorer />} />
                        <Route path="/invoice/:hash" element={<InvoiceDetails />} />
                        <Route path="/create" element={<CreateInvoice />} />
                        <Route path="/pay" element={<PaymentPage />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
