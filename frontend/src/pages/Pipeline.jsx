import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { Mail, Phone, KanbanSquare } from 'lucide-react';
import api from '../services/api';

const Pipeline = () => {
  const [columns, setColumns] = useState({
    NEW: { id: 'NEW', title: 'New Leads', color: 'border-blue-500', bg: 'bg-blue-50', items: [] },
    CONTACTED: { id: 'CONTACTED', title: 'Contacted', color: 'border-yellow-500', bg: 'bg-yellow-50', items: [] },
    QUALIFIED: { id: 'QUALIFIED', title: 'Qualified', color: 'border-purple-500', bg: 'bg-purple-50', items: [] },
    CONVERTED: { id: 'CONVERTED', title: 'Converted', color: 'border-green-500', bg: 'bg-green-50', items: [] }
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get('/customers');
      
      const newCols = {
        NEW: { ...columns.NEW, items: [] },
        CONTACTED: { ...columns.CONTACTED, items: [] },
        QUALIFIED: { ...columns.QUALIFIED, items: [] },
        CONVERTED: { ...columns.CONVERTED, items: [] }
      };

      data.forEach(customer => {
        if (newCols[customer.status]) {
          newCols[customer.status].items.push(customer);
        }
      });

      setColumns(newCols);
    } catch (error) {
      toast.error('Failed to load pipeline data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
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
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, items: sourceItems }
      });
    } else {
      movedItem.status = destination.droppableId;
      destItems.splice(destination.index, 0, movedItem);
      
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, items: sourceItems },
        [destination.droppableId]: { ...destCol, items: destItems }
      });

      try {
        await api.put(`/customers/${movedItem.id}`, {
          firstName: movedItem.firstName,
          lastName: movedItem.lastName,
          email: movedItem.email,
          phone: movedItem.phone || '',
          status: destination.droppableId
        });
        toast.success(`Lead moved to ${destCol.title}`);
      } catch (error) {
        toast.error('Failed to update lead status');
        fetchCustomers(); 
      }
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Pipeline...</div>;

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <KanbanSquare className="w-6 h-6 mr-2 text-primary" />
            Sales Pipeline
          </h2>
          <p className="text-sm text-gray-500 mt-1">Drag and drop leads to update their status</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-6 min-w-max h-full">
            {Object.values(columns).map((column) => (
              <div key={column.id} className="w-80 flex flex-col">
                <div className={`p-4 rounded-t-xl border-t-4 ${column.color} bg-white shadow-sm border-b border-gray-100 flex justify-between items-center`}>
                  <h3 className="font-bold text-gray-800">{column.title}</h3>
                  <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                    {column.items.length}
                  </span>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 p-3 rounded-b-xl transition-colors ${
                        snapshot.isDraggingOver ? column.bg : 'bg-gray-50/50'
                      } border-x border-b border-gray-100 min-h-[500px] space-y-3`}
                    >
                      {column.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 transition-all ${
                                snapshot.isDragging ? 'shadow-lg ring-2 ring-primary rotate-2' : 'hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-gray-900 text-sm">
                                  {item.firstName} {item.lastName}
                                </h4>
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                  {item.firstName.charAt(0)}{item.lastName.charAt(0)}
                                </div>
                              </div>
                              <div className="space-y-1 mt-3">
                                <div className="flex items-center text-xs text-gray-500">
                                  <Mail className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                  <span className="truncate">{item.email}</span>
                                </div>
                                {item.phone && (
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Phone className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                    <span>{item.phone}</span>
                                  </div>
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
    </div>
  );
};

export default Pipeline;