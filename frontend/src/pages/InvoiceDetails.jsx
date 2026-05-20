import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ArrowLeft, Download, CheckCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import api from '../services/api';

const InvoiceDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const { data } = await api.get(`/invoices/${id}`);
        setInvoice(data);
      } catch (error) {
        toast.error('Failed to fetch invoice details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await api.patch(`/invoices/${id}/status`, { status: newStatus });
      setInvoice({ ...invoice, status: newStatus });
      toast.success(`Invoice marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const downloadPDF = () => {
    setIsDownloading(true);
    const element = document.getElementById('invoice-print-area');
    
    html2canvas(element, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoice.invoiceNumber}.pdf`);
      setIsDownloading(false);
    });
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading invoice...</div>;
  if (!invoice) return <div className="p-8 text-center text-gray-500">Invoice not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <Link to="/invoices" className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h2 className="text-xl font-bold text-gray-800">Invoice #{invoice.invoiceNumber}</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            invoice.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {invoice.status}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={invoice.status} 
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
          
          <button 
            onClick={downloadPDF}
            disabled={isDownloading}
            className="flex items-center bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>

      <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <div id="invoice-print-area" className="min-w-[800px] p-8 bg-white relative">
          
          <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">INVOICE</h1>
              <p className="text-gray-500 mt-2 text-sm font-medium">#{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold text-gray-800">{user?.company?.name || 'Your Company'}</h3>
              <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
            </div>
          </div>

          <div className="flex justify-between mb-10">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</p>
              <p className="text-lg font-bold text-gray-800">{invoice.customer.firstName} {invoice.customer.lastName}</p>
              <p className="text-gray-500 text-sm">{invoice.customer.email}</p>
              {invoice.customer.phone && <p className="text-gray-500 text-sm">{invoice.customer.phone}</p>}
            </div>
            <div className="text-right">
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date Issued</p>
                <p className="text-sm font-medium text-gray-800">{new Date(invoice.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Due Date</p>
                <p className="text-sm font-medium text-gray-800">{new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <table className="w-full text-left mb-8">
            <thead>
              <tr className="border-b-2 border-gray-800 text-gray-800">
                <th className="py-3 font-bold">Description</th>
                <th className="py-3 font-bold text-center">Qty</th>
                <th className="py-3 font-bold text-right">Unit Price</th>
                <th className="py-3 font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-4">{item.description}</td>
                  <td className="py-4 text-center">{item.quantity}</td>
                  <td className="py-4 text-right">${item.unitPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  <td className="py-4 text-right font-medium">${item.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>${invoice.subTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm border-b border-gray-200 pb-3">
                <span>Tax ({invoice.taxRate}%)</span>
                <span>${((invoice.subTotal * invoice.taxRate) / 100).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-1">
                <span>Total</span>
                <span>${invoice.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
              <p className="text-sm text-gray-600">{invoice.notes}</p>
            </div>
          )}
          
          {invoice.status === 'PAID' && (
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
              <CheckCircle className="w-96 h-96 text-green-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;