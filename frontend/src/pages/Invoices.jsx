import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Trash2, FileText, Eye } from 'lucide-react';
import api from '../services/api';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchInvoices = async () => {
    try {
      const { data } = await api.get('/invoices');
      setInvoices(data);
    } catch (error) {
      toast.error('Failed to fetch invoices');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      await api.delete(`/invoices/${id}`);
      toast.success('Invoice deleted');
      setInvoices(invoices.filter((inv) => inv.id !== id));
    } catch (error) {
      toast.error('Failed to delete invoice');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'SENT': return 'bg-blue-100 text-blue-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Invoices</h2>
          <p className="text-sm text-gray-500">Manage billing and payments</p>
        </div>
        <Link
          to="/invoices/new"
          className="flex items-center bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Invoice
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Invoice ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Due Date</th>
                <th className="p-4 font-semibold">Total Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading invoices...</td></tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-500">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-gray-900">No invoices yet</p>
                    <p>Create your first invoice to get started.</p>
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{invoice.invoiceNumber}</td>
                    <td className="p-4 text-gray-700">
                      {invoice.customer.firstName} {invoice.customer.lastName}
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-semibold text-gray-900">
                      ${invoice.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button 
                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                        className="px-3 py-1.5 border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors inline-flex items-center shadow-sm"
                        title="View Invoice"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        View
                      </button>
                      <button 
                        onClick={() => handleDelete(invoice.id)}
                        className="px-3 py-1.5 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors inline-flex items-center shadow-sm"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoices;