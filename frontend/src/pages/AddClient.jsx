import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Building2, Mail, Phone, MapPin, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

function AddClient() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    client_name: '',
    company_name: '',
    email: '',
    phone: '',
    city: '',
    contact_person: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(`${API_URL}/clients`, formData);
      navigate('/clients');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create client. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: 'client_name', label: 'Client Name', type: 'text', icon: User, placeholder: 'John Doe' },
    { name: 'company_name', label: 'Company Name', type: 'text', icon: Building2, placeholder: 'ABC Corporation' },
    { name: 'email', label: 'Email Address', type: 'email', icon: Mail, placeholder: 'john@example.com' },
    { name: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, placeholder: '+91 98765 43210' },
    { name: 'city', label: 'City', type: 'text', icon: MapPin, placeholder: 'Bangalore' },
    { name: 'contact_person', label: 'Contact Person', type: 'text', icon: User, placeholder: 'Jane Smith' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/clients')}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to clients</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Add New Client</h1>
        <p className="text-gray-600 mt-1">Fill in the details to add a new client</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {inputFields.map(({ name, label, type, icon: Icon, placeholder }) => (
            <div key={name} className={name === 'email' || name === 'phone' ? 'md:col-span-2' : ''}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  placeholder={placeholder}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center space-x-2 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <span>Create Client</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/clients')}
            className="px-6 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddClient;
