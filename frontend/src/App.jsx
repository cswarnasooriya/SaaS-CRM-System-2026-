import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Temporary placeholders (Api me pages issarahata hadanawa)
const Login = () => <div className="p-10 text-2xl font-bold">Login Page</div>;
const Register = () => <div className="p-10 text-2xl font-bold">Register Company</div>;
const Dashboard = () => <div className="p-10 text-2xl font-bold text-primary">SaaS Dashboard</div>;

function App() {
  return (
    <Router>
      {/* Notifications walata */}
      <Toaster position="top-right" /> 
      
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Default route */}
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;