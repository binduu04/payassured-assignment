import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Loader2, AlertCircle, User, Building2, Mail, Phone, MapPin, UserCircle } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/clients`);
      setClients(response.data.clients);
      setError(null);
    } catch (err) {
      setError('Failed to fetch clients. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">{clients.length} total clients</p>
        </div>
        <Link
          to="/clients/add"
          className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add Client</span>
        </Link>
      </div>

      {/* Content */}
      {clients.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No clients yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first client</p>
          <Link
            to="/clients/add"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Add your first client</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <span>Client Name</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      
                      <span>Company</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      
                      <span>City</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      
                      <span>Contact Person</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      
                      <span>Phone</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                     
                      <span>Email</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{client.client_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{client.company_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{client.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{client.contact_person}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{client.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{client.email}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientList;
