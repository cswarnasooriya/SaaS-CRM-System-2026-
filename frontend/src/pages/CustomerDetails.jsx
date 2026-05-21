import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Mail, Phone, Calendar, MessageSquare, FileText, CheckSquare, Send, Plus, X } from 'lucide-react';
import api from '../services/api';

const CustomerDetails = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Forms states
  const [newNote, setNewNote] = useState('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  const fetchCustomerData = async () => {
    try {
      const { data } = await api.get(`/customers/${id}`);
      setCustomer(data);
    } catch (error) {
      toast.error('Failed to load customer details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Note save kireema
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      await api.post(`/customers/${id}/notes`, { content: newNote });
      setNewNote('');
      fetchCustomerData(); 
      toast.success('Internal note saved successfully!');
    } catch (error) {
      toast.error('Failed to save note');
    }
  };

  // Task assign kireema
  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/customers/${id}/tasks`, taskData);
      toast.success('New task assigned to this client!');
      setIsTaskModalOpen(false);
      setTaskData({ title: '', description: '', dueDate: '' });
      fetchCustomerData(); 
    } catch (error) {
      toast.error('Failed to assign task');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'CONTACTED': return 'bg-yellow-100 text-yellow-800';
      case 'QUALIFIED': return 'bg-purple-100 text-purple-800';
      case 'CONVERTED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  if (!customer) return <div className="p-8 text-center text-gray-500">Customer not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Link to="/customers" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 border border-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Customer 360° Profile</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card & Internal Notes */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Details */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-2xl mb-4">
              {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{customer.firstName} {customer.lastName}</h3>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(customer.status)}`}>
              {customer.status}
            </span>
            
            <div className="mt-6 space-y-3 text-sm text-left">
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-3 text-gray-400" /> {customer.email}
              </div>
              {customer.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-3 text-gray-400" /> {customer.phone}
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-3 text-gray-400" /> 
                Added {new Date(customer.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Internal Notes - BUTTON FIXED */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4">
              <MessageSquare className="w-5 h-5 mr-2 text-primary" /> Internal Notes
            </h3>
            
            <form onSubmit={handleAddNote} className="mb-6 space-y-2">
              <textarea 
                rows="3" 
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log a call, meeting, or detail..."
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-sm resize-none"
              ></textarea>
              
              {/* Lassanata visible solid button ekak yataata damma */}
              <button 
                type="submit" 
                className="w-full flex items-center justify-center bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                <Send className="w-4 h-4 mr-2" />
                Save Internal Note
              </button>
            </form>

            <div className="space-y-4 max-h-96 overflow-y-auto pt-2">
              {customer.notes.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">No notes added yet.</p>
              ) : (
                customer.notes.map((note) => (
                  <div key={note.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-800 whitespace-pre-line">{note.content}</p>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span className="font-medium text-gray-700">By {note.user?.name || 'User'}</span>
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Invoices & Tasks Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Tasks Management */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <CheckSquare className="w-5 h-5 mr-2 text-primary" /> Tasks & Follow-ups
              </h3>
              <button 
                onClick={() => setIsTaskModalOpen(true)}
                className="text-sm flex items-center bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-semibold transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" /> Assign Task
              </button>
            </div>
            
            <div className="space-y-3">
              {customer.tasks.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No tasks assigned to this client yet.</p>
              ) : (
                customer.tasks.map((task) => (
                  <div key={task.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
                    <div>
                      <p className={`font-bold text-sm ${task.status === 'COMPLETED' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {task.title}
                      </p>
                      {task.description && <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>}
                      <p className="text-xs text-gray-400 mt-1 flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-red-400" />
                        Due: {new Date(task.dueDate).toLocaleDateString()} | Created by: {task.user?.name}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded font-bold ${
                      task.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Related Invoices History */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" /> Invoices & Billing
              </h3>
              <Link to="/invoices/new" className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ New Invoice</Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500">
                    <th className="pb-3 font-medium">Invoice ID</th>
                    <th className="pb-3 font-medium">Date Due</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {customer.invoices.length === 0 ? (
                    <tr><td colSpan="5" className="py-4 text-center text-gray-500">No invoices generated for this client.</td></tr>
                  ) : (
                    customer.invoices.map((inv) => (
                      <tr key={inv.id}>
                        <td className="py-3 font-medium text-gray-900">{inv.invoiceNumber}</td>
                        <td className="py-3 text-gray-600">{new Date(inv.dueDate).toLocaleDateString()}</td>
                        <td className="py-3 font-bold text-gray-900">${inv.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            inv.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Link to={`/invoices/${inv.id}`} className="text-primary hover:underline font-semibold">View</Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Dynamic Task Assignment Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Assign Task to {customer.firstName}</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleTaskSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Send business proposal"
                  value={taskData.title}
                  onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input 
                  type="date" 
                  required 
                  value={taskData.dueDate}
                  onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Description (Optional)</label>
                <textarea 
                  rows="3" 
                  placeholder="Mention key services and packages discussed..."
                  value={taskData.description}
                  onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                ></textarea>
              </div>

              <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white hover:bg-blue-700 rounded-lg font-medium transition-colors">
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;