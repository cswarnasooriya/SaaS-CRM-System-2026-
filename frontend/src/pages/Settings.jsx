import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Users, Plus, Shield, Mail, X, Building2 } from 'lucide-react';
import api from '../services/api';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  });

  const fetchTeam = async () => {
    try {
      const { data } = await api.get('/team');
      setTeam(data);
    } catch (error) {
      toast.error('Failed to load team members');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/team', formData);
      toast.success('Team member added successfully!');
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'USER' });
      fetchTeam(); // Table eka refresh karanawa
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add team member');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Company Profile Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start space-x-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <Building2 className="w-12 h-12 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{user?.company?.name || 'Your Company'}</h2>
          <p className="text-gray-500 mt-1">Manage your workspace and team members.</p>
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            <Shield className="w-4 h-4 mr-2 text-gray-500" />
            Your Role: {user?.role}
          </div>
        </div>
      </div>

      {/* Team Management Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Team Members</h3>
            <p className="text-sm text-gray-500">People who have access to this workspace</p>
          </div>
          {/* Only Admins can add members (Optional UI check) */}
          {user?.role !== 'USER' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Member
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-500">Loading team...</td></tr>
              ) : (
                team.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs mr-3">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{member.name}</span>
                        {user.id === member.id && <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">You</span>}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {member.email}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        member.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Invite Team Member</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
                <input type="password" name="password" required value={formData.password} onChange={handleChange} minLength="6" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                <p className="text-xs text-gray-500 mt-1">They can change this later after logging in.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="USER">Sales Rep (User)</option>
                  <option value="ADMIN">Manager (Admin)</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white hover:bg-blue-700 rounded-lg font-medium transition-colors">
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;