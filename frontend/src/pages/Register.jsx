import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Building2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    userName: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      
      toast.success('Company registered successfully!');
      // Register una gaman automatically login wenawa
      login(response.data.user, response.data.token);
      
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-8">
        
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Setup your SaaS CRM workspace
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                name="companyName"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Warna Digital Solutions"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Admin Name</label>
              <input
                type="text"
                name="userName"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Sandaruwan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Work Email</label>
              <input
                type="email"
                name="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={formData.email}
                onChange={handleChange}
                placeholder="hello@warnadigital.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                required
                minLength="6"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {isLoading ? (
              'Creating Workspace...'
            ) : (
              <>
                <Building2 className="w-5 h-5 mr-2" />
                Register Company
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-blue-700">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;