import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { Plus, Trash2, Calendar, X, CheckCircle, LayoutGrid, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Tasks = () => {
  const [columns, setColumns] = useState({
    TODO: { id: 'TODO', title: 'To Do', border: 'border-t-gray-400', bg: 'bg-gray-50', items: [] },
    IN_PROGRESS: { id: 'IN_PROGRESS', title: 'In Progress', border: 'border-t-blue-500', bg: 'bg-blue-50/40', items: [] },
    REVIEW: { id: 'REVIEW', title: 'Under Review', border: 'border-t-orange-500', bg: 'bg-orange-50/40', items: [] },
    COMPLETED: { id: 'COMPLETED', title: 'Completed', border: 'border-t-green-500', bg: 'bg-green-50/40', items: [] }
  });
  
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completionRate, setCompletionRate] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    customerId: '',
    status: 'TODO'
  });

  const fetchWorkspaceTasks = async () => {
    try {
      const [tasksRes, customersRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/customers')
      ]);

      setCustomers(customersRes.data);
      const allTasks = tasksRes.data;

      // Calculate Visual Completion Rate
      const completed = allTasks.filter(t => t.status === 'COMPLETED').length;
      const rate = allTasks.length > 0 ? Math.round((completed / allTasks.length) * 100) : 0;
      setCompletionRate(rate);

      const updatedCols = {
        TODO: { ...columns.TODO, items: [] },
        IN_PROGRESS: { ...columns.IN_PROGRESS, items: [] },
        REVIEW: { ...columns.REVIEW, items: [] },
        COMPLETED: { ...columns.COMPLETED, items: [] }
      };

      allTasks.forEach(task => {
        if (updatedCols[task.status]) {
          updatedCols[task.status].items.push(task);
        }
      });

      setColumns(updatedCols);
    } catch (error) {
      toast.error('Failed to update task framework metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceItems = [...sourceCol.items];
    const destItems = [...destCol.items];

    const [movedItem] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, movedItem);
      setColumns({ ...columns, [source.droppableId]: { ...sourceCol, items: sourceItems } });
    } else {
      movedItem.status = destination.droppableId;
      destItems.splice(destination.index, 0, movedItem);

      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, items: sourceItems },
        [destination.droppableId]: { ...destCol, items: destItems }
      });

      try {
        await api.patch(`/tasks/${movedItem.id}/status`, { status: destination.droppableId });
        toast.success(`Task shifted to ${destCol.title}`);
        
        // Recalculate completion rates instantly
        const totalTasksCount = Object.values(columns).reduce((sum, col) => sum + col.items.length, 0);
        const completedCount = destination.droppableId === 'COMPLETED' 
          ? columns.COMPLETED.items.length + 1 
          : (source.droppableId === 'COMPLETED' ? columns.COMPLETED.items.length - 1 : columns.COMPLETED.items.length);
        setCompletionRate(totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0);
      } catch (error) {
        toast.error('Failed to sync state changes');
        fetchWorkspaceTasks();
      }
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', formData);
      toast.success('Agile task created successfully!');
      setIsModalOpen(false);
      setFormData({ title: '', description: '', dueDate: '', customerId: '', status: 'TODO' });
      fetchWorkspaceTasks();
    } catch (error) {
      toast.error('Failed to sync new task payload');
    }
  };

  const handleDeleteTask = async (columnId, taskId) => {
    if (!window.confirm('Permanently remove this task card?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task removed');
      fetchWorkspaceTasks();
    } catch (error) {
      toast.error('Failed to remove task resource');
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Syncing Kanban Engine...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <LayoutGrid className="w-5 h-5 mr-2 text-blue-600" />
            Project Task Workspace
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">Visually optimize project workflows and track performance timelines</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-bold transition-all transform hover:scale-102 active:scale-98 cursor-pointer shadow-md shadow-blue-600/10"
        >
          <Plus className="w-4 h-4 mr-1.5 stroke-" /> Create Agile Task
        </button>
      </div>

      {/* Premium Analytics Aggregator Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Actions</p>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {Object.values(columns).reduce((sum, c) => sum + c.items.length, 0)}
            </p>
          </div>
          <Clock className="w-8 h-8 text-blue-500 bg-blue-50 p-1.5 rounded-lg" />
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">In Progress</p>
            <p className="text-2xl font-black text-blue-600 mt-1">{columns.IN_PROGRESS.items.length}</p>
          </div>
          <AlertCircle className="w-8 h-8 text-blue-500 bg-blue-50 p-1.5 rounded-lg" />
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Under Review</p>
            <p className="text-2xl font-black text-orange-500 mt-1">{columns.REVIEW.items.length}</p>
          </div>
          <AlertCircle className="w-8 h-8 text-orange-500 bg-orange-50 p-1.5 rounded-lg" />
        </div>
        
        {/* Core Tracker Feature: Live Metric Aggregator Card */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Project Completion</p>
            <span className="text-sm font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-1.5">
            <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>
      </div>

      {/* Dynamic Drag and Drop Columns Board */}
      <div className="flex-1 overflow-x-auto pb-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4 min-w-max h-full items-start">
            {Object.values(columns).map(column => (
              <div key={column.id} className="w-72 sm:w-80 flex flex-col shrink-0">
                {/* Column Node Header */}
                <div className={`p-4 bg-white rounded-t-xl border-t-4 ${column.border} shadow-sm border-b border-gray-100 flex justify-between items-center cursor-default`}>
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">{column.title}</h3>
                  <span className="bg-gray-100 text-gray-600 text-xs font-black px-2 py-0.5 rounded-full">
                    {column.items.length}
                  </span>
                </div>

                {/* Droppable Stage Area */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`p-2.5 sm:p-3 rounded-b-xl transition-colors duration-200 min-h-[450px] space-y-3 border-x border-b border-gray-100/70 ${
                        snapshot.isDraggingOver ? column.bg : 'bg-gray-50/50'
                      }`}
                    >
                      {column.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-200 cursor-pointer select-none relative group ${
                                snapshot.isDragging ? 'shadow-xl ring-2 ring-blue-600 rotate-2 scale-[1.02]' : 'hover:border-gray-300 hover:shadow-md'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-bold text-gray-900 text-sm leading-tight transition-colors duration-150 group-hover:text-blue-600">
                                  {item.title}
                                </h4>
                                <button 
                                  onClick={() => handleDeleteTask(column.id, item.id)}
                                  className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {item.description && (
                                <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                                  {item.description}
                                </p>
                              )}

                              {/* Task Card Visual Metadata Footer */}
                              <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2 items-center justify-between text-[10px] font-bold text-gray-400">
                                <span className="flex items-center text-red-500 bg-red-50 px-2 py-0.5 rounded">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {new Date(item.dueDate).toLocaleDateString()}
                                </span>
                                {item.customer && (
                                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded max-w-[120px] truncate">
                                    Client: {item.customer.firstName}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Task Creation Modal Popup Context */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Add Agile Project Task</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Task Title</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Design checkout flow architectures" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Due Date</label>
                  <input 
                    type="date" 
                    name="dueDate" 
                    required 
                    value={formData.dueDate} 
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Initial Stage</label>
                  <select 
                    name="status" 
                    value={formData.status} 
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">Under Review</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Related Customer (Optional)</label>
                <select 
                  name="customerId" 
                  value={formData.customerId} 
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white"
                >
                  <option value="">-- No Customer Assignment --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Scope Details</label>
                <textarea 
                  name="description" 
                  rows="3" 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Elaborate actionable checklist or framework goals..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                ></textarea>
              </div>

              <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  Save Task Card
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