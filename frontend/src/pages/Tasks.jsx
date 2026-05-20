import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, CheckCircle2, Circle, Calendar, X } from 'lucide-react';
import api from '../services/api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    customerId: '',
  });

  const fetchData = async () => {
    try {
      const [tasksRes, customersRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/customers')
      ]);
      setTasks(tasksRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', formData);
      toast.success('Task added successfully!');
      setIsModalOpen(false);
      setFormData({ title: '', description: '', dueDate: '', customerId: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
    try {
      await api.patch(`/tasks/${task.id}/status`, { status: newStatus });
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
      toast.success(`Task marked as ${newStatus.toLowerCase()}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const pendingTasks = tasks.filter(t => t.status === 'PENDING');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Tasks & Reminders</h2>
          <p className="text-sm text-gray-500">Keep track of your client follow-ups</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Task
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
            <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg font-medium text-gray-900">You're all caught up!</p>
            <p>Add a task to keep track of follow-ups.</p>
          </div>
        ) : (
          <>
            {/* PENDING TASKS */}
            {pendingTasks.map(task => (
              <div key={task.id} className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-yellow-400 border-gray-100 flex items-start justify-between transition-all hover:shadow-md">
                <div className="flex items-start space-x-4">
                  <button onClick={() => toggleTaskStatus(task)} className="mt-1 text-gray-400 hover:text-green-500 transition-colors">
                    <Circle className="w-6 h-6" />
                  </button>
                  <div>
                    <h3 className="font-bold text-gray-900">{task.title}</h3>
                    {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                    <div className="flex items-center mt-3 space-x-4 text-xs font-medium">
                      <span className="flex items-center text-red-500 bg-red-50 px-2 py-1 rounded">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      {task.customer && (
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          Client: {task.customer.firstName} {task.customer.lastName}
                        </span>
                      )}
                      <span className="text-gray-400">Assigned to: {task.user.name}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            {/* COMPLETED TASKS */}
            {completedTasks.length > 0 && (
              <div className="pt-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Completed</h3>
                <div className="space-y-3">
                  {completedTasks.map(task => (
                    <div key={task.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start justify-between opacity-75">
                      <div className="flex items-start space-x-4">
                        <button onClick={() => toggleTaskStatus(task)} className="mt-0.5 text-green-500 hover:text-gray-400 transition-colors">
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <div>
                          <h3 className="font-medium text-gray-500 line-through">{task.title}</h3>
                        </div>
                      </div>
                      <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Add New Task</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="Call John regarding quote" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input type="date" name="dueDate" required value={formData.dueDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Related Customer (Optional)</label>
                <select name="customerId" value={formData.customerId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="">-- No Customer --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Details / Notes</label>
                <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"></textarea>
              </div>

              <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white hover:bg-blue-700 rounded-lg font-medium transition-colors">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;