import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText, IndianRupee, Calendar, User, Building2, Edit3, Save, X, Loader2, AlertCircle, ListChecks, FileEdit, Clock } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    last_follow_up_notes: ''
  });

  useEffect(() => {
    fetchCaseDetails();
  }, [id]);

  const fetchCaseDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/cases`);
      const foundCase = response.data.cases.find(c => c.id === parseInt(id));
      
      if (foundCase) {
        setCaseData(foundCase);
        setUpdateData({
          status: foundCase.status,
          last_follow_up_notes: foundCase.last_follow_up_notes || ''
        });
        setError(null);
      } else {
        setError('Case not found');
      }
    } catch (err) {
      setError('Failed to fetch case details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.patch(`${API_URL}/cases/${id}`, updateData);
      await fetchCaseDetails();
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update case');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  if (loading && !caseData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error && !caseData) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
        <Link to="/cases" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cases</span>
        </Link>
      </div>
    );
  }

  if (!caseData) {
    return null;
  }

  const statusConfig = getStatusConfig(caseData.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/cases')}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to cases</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Case Details</h1>
          <p className="text-gray-600 mt-1">Invoice #{caseData.invoice_number}</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Edit3 className="w-4 h-4" />
            <span>Update Case</span>
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Invoice Information */}
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-gray-600" />
            <span>Invoice Information</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <FileText className="w-4 h-4" />
                <span className="font-medium">Invoice Number</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{caseData.invoice_number}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <IndianRupee className="w-4 h-4" />
                <span className="font-medium">Invoice Amount</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(caseData.invoice_amount)}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Invoice Date</span>
              </div>
              <p className="text-gray-900">{formatDate(caseData.invoice_date)}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Due Date</span>
              </div>
              <p className="text-gray-900">{formatDate(caseData.due_date)}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Created On</span>
              </div>
              <p className="text-gray-900">{formatDate(caseData.created_at)}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Last Updated</span>
              </div>
              <p className="text-gray-900">{formatDate(caseData.updated_at)}</p>
            </div>
          </div>
        </div>

        {/* Client Information & Status */}
        <div className="space-y-6">
          {/* Client Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-600" />
              <span>Client</span>
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Client Name</div>
                <p className="text-lg font-semibold text-gray-900">{caseData.client_name}</p>
              </div>

              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                  <Building2 className="w-4 h-4" />
                  <span>Company</span>
                </div>
                <p className="text-gray-900">{caseData.company_name}</p>
              </div>

              <Link
                to="/clients"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
              >
                <span>View all clients</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <ListChecks className="w-5 h-5 text-gray-600" />
              <span>Status</span>
            </h2>
            <span className={`inline-flex px-4 py-2 text-sm font-medium rounded-lg border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
              {caseData.status}
            </span>
          </div>
        </div>
      </div>

      {/* Follow-up Notes Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <FileEdit className="w-5 h-5 text-gray-600" />
          <span>Follow-up Notes & Updates</span>
        </h2>

        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <ListChecks className="w-4 h-4" />
                <span>Update Status <span className="text-red-500">*</span></span>
              </label>
              <select
                value={updateData.status}
                onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="New">New</option>
                <option value="In Follow-up">In Follow-up</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileEdit className="w-4 h-4" />
                <span>Follow-up Notes</span>
              </label>
              <textarea
                value={updateData.last_follow_up_notes}
                onChange={(e) => setUpdateData({...updateData, last_follow_up_notes: e.target.value})}
                rows="6"
                placeholder="Add notes about communications, payments, agreements, or next steps..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setUpdateData({
                    status: caseData.status,
                    last_follow_up_notes: caseData.last_follow_up_notes || ''
                  });
                }}
                className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            {caseData.last_follow_up_notes ? (
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{caseData.last_follow_up_notes}</p>
            ) : (
              <p className="text-gray-500 italic flex items-center space-x-2">
                <FileEdit className="w-5 h-5" />
                <span>No follow-up notes yet. Click "Update Case" to add notes and track progress.</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CaseDetail;
