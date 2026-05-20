import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import api from '../services/api';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  
  // Default Random Invoice Number Generator
  const generateInvoiceNumber = () => `INV-${Math.floor(1000 + Math.random() * 9000)}`;

  const [formData, setFormData] = useState({
    customerId: '',
    invoiceNumber: generateInvoiceNumber(),
    dueDate: '',
    taxRate: 0,
    notes: '',
  });

  // Dynamic Line Items State
  const [items, setItems] = useState([
    { description: '', quantity: 1, unitPrice: 0 }
  ]);

  // Fetch Customers for the dropdown
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await api.get('/customers');
        setCustomers(data);
      } catch (error) {
        toast.error('Failed to load customers');
      }
    };
    fetchCustomers();
  }, []);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Item ekak edit karaddi wena wenasak
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // UI eke pennanna total eka calculate kirima
  const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = (subTotal * formData.taxRate) / 100;
  const total = subTotal + taxAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Please add at least one item');
    if (!formData.customerId) return toast.error('Please select a customer');

    try {
      await api.post('/invoices', {
        ...formData,
        taxRate: Number(formData.taxRate),
        items: items.map(item => ({
          ...item,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice)
        }))
      });
      toast.success('Invoice created successfully!');
      navigate('/invoices'); // Submit unama Invoices table ekata yanawa
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create invoice');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link to="/invoices" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 border border-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Create New Invoice</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Details Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>
            <select name="customerId" required value={formData.customerId} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="">-- Select Customer --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
            <input type="text" name="invoiceNumber" required value={formData.invoiceNumber} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input type="date" name="dueDate" required value={formData.dueDate} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
        </div>

        {/* Dynamic Line Items Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Invoice Items</h3>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                  <input type="text" required placeholder="Web Design Services" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="w-24">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Qty</label>
                  <input type="number" min="1" required value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Price ($)</label>
                  <input type="number" min="0" required value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="pt-6">
                  <button type="button" onClick={() => removeItem(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button type="button" onClick={addItem} className="mt-4 flex items-center text-primary font-medium hover:text-blue-700">
            <Plus className="w-4 h-4 mr-1" /> Add Another Item
          </button>
        </div>

        {/* Totals & Notes Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Terms</label>
            <textarea name="notes" rows="4" value={formData.notes} onChange={handleFormChange} placeholder="Thank you for your business!" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"></textarea>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-900">${subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center">
                Tax Rate (%) 
                <input type="number" name="taxRate" min="0" max="100" value={formData.taxRate} onChange={handleFormChange} className="ml-2 w-16 px-2 py-1 border border-gray-300 rounded-md text-sm" />
              </span>
              <span className="font-medium text-gray-900">${taxAmount.toFixed(2)}</span>
            </div>
            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">Total:</span>
              <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="flex items-center bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-md">
            <Save className="w-5 h-5 mr-2" />
            Save & Generate Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;