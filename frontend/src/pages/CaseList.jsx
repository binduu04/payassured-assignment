import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FileText, Calendar, IndianRupee, Building2, User, Filter, ArrowUpDown, Loader2, AlertCircle, Eye } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

function CaseList() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchCases();
  }, [statusFilter, sortOrder]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/cases?sort=${sortOrder}`;
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }
      
      const response = await axios.get(url);
      setCases(response.data.cases);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cases. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusConfig = (status) => {
    const configs = {
      'New': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
      'In Follow-up': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
      'Partially Paid': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
      'Closed': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' }
    };
    return configs[status] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recovery Cases</h1>
          <p className="text-gray-600 mt-1">{cases.length} total cases</p>
        </div>
        <Link
          to="/cases/add"
          className="inline-flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add Case</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4" />
              <span>Filter by Status</span>
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="In Follow-up">In Follow-up</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <ArrowUpDown className="w-4 h-4" />
              <span>Sort by Due Date</span>
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="asc">Earliest First</option>
              <option value="desc">Latest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {cases.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No cases yet</h3>
          <p className="text-gray-600 mb-6">Start tracking your recovery cases</p>
          <Link
            to="/cases/add"
            className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Add your first case</span>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {cases.map((caseItem) => {
            const statusConfig = getStatusConfig(caseItem.status);
            return (
              <div
                key={caseItem.id}
                onClick={() => navigate(`/cases/${caseItem.id}`)}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="grid md:grid-cols-4 gap-4">
                  {/* Client Info */}
                  <div className="md:col-span-2 space-y-1">
                    <div className="flex items-center space-x-2 text-gray-500 text-sm">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Client</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{caseItem.client_name}</p>
                    <div className="flex items-center space-x-2 text-gray-500 text-sm">
                      <Building2 className="w-4 h-4" />
                      <span>{caseItem.company_name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-500 text-sm mt-3">
                      <FileText className="w-4 h-4" />
                      <span className="font-medium">Invoice:</span>
                      <span className="text-gray-900">{caseItem.invoice_number}</span>
                    </div>
                  </div>

                  {/* Amount & Date */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-gray-500 text-sm">
                      <IndianRupee className="w-4 h-4" />
                      <span className="font-medium">Amount</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(caseItem.invoice_amount)}</p>
                    
                    <div className="flex items-center space-x-2 text-gray-500 text-sm mt-3">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">Due Date</span>
                    </div>
                    <p className="text-gray-900">{formatDate(caseItem.due_date)}</p>
                  </div>

                  {/* Status & Action */}
                  <div className="flex flex-col justify-between items-start md:items-end">
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                      {caseItem.status}
                    </span>
                    
                    <Link
                      to={`/cases/${caseItem.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mt-4"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CaseList;
