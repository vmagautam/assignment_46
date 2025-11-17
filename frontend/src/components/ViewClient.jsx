import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Settings, Edit } from 'lucide-react'
import clientService from '../services/clientService'

const ViewClient = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [clientData, setClientData] = useState(null)

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true)
        const data = await clientService.getClientById(id)
        const gstDetail = data.gst_details?.[0] || {}
        setClientData({ ...data.client, ...gstDetail })
      } catch (error) {
        console.error('Error fetching client:', error)
        setClientData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchClient()
  }, [id])

  const handleEdit = () => {
    navigate(`/edit-client/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-8 text-center text-gray-500">
          Loading client data...
        </div>
      </div>
    )
  }

  if (!clientData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-8 text-center text-red-500">
          Client not found
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button className="p-1 hover:text-gray-800" onClick={() => navigate('/clients')}>
            <ArrowLeft size={20} />
          </button>
          <button className="text-blue-600 hover:underline" onClick={() => navigate('/clients')}>Clients</button>
          <span>›</span>
          <span className="text-gray-800 font-medium">View Client</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            onClick={handleEdit}
          >
            <Edit size={16} />
            Edit Client
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">{clientData.business_name}</h1>
          <div className="text-sm text-gray-500">Client ID: {clientData.client_id}</div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">Basic Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Business Entity</label>
                <div className="text-gray-900">{clientData.business_entity}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Business Name</label>
                <div className="text-gray-900">{clientData.business_name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Contact Name</label>
                <div className="text-gray-900">{clientData.contact_name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Contact Number</label>
                <div className="text-gray-900">{clientData.contact_number}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email ID</label>
                <div className="text-gray-900">{clientData.email_id}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Currency</label>
                <div className="text-gray-900">{clientData.currency === 'INR' ? 'Rupees INR ₹' : clientData.currency}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Client Creation Date</label>
                <div className="text-gray-900">{new Date(clientData.client_creation_date).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">Other Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">GSTIN</label>
                <div className="text-gray-900">{clientData.gstin || 'Not provided'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">GST Registration Type</label>
                <div className="text-gray-900">{clientData.gst_registration_type}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">State</label>
                <div className="text-gray-900">{clientData.state}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Pincode</label>
                <div className="text-gray-900">{clientData.pincode || 'Not provided'}</div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                <div className="text-gray-900">{clientData.address || 'Not provided'}</div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Address Line 2</label>
                <div className="text-gray-900">{clientData.address_line_2 || 'Not provided'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">GST Registration Date</label>
                <div className="text-gray-900">
                  {clientData.gst_registration_date 
                    ? new Date(clientData.gst_registration_date).toLocaleDateString()
                    : 'Not provided'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewClient