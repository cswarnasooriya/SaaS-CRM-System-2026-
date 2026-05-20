import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';

// Temporary placeholders
const Register = () => <div className="p-10 text-2xl font-bold">Register Company</div>;
const Dashboard = () => <div className="p-10 text-2xl font-bold text-primary">SaaS Dashboard</div>;

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Toaster position="top-right" /> 
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;