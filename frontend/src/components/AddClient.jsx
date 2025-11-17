import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Settings } from 'lucide-react'
import Toast from './Toast'
import clientService from '../services/clientService'

const AddClient = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    businessEntity: '',
    businessName: '',
    contactName: '',
    contactNumber: '',
    emailId: '',
    clientId: '',
    currency: 'INR',
    clientCreationDate: '2025-11-07',
    gstin: '',
    gstRegistrationType: 'Regular',
    state: 'Karnataka',
    pincode: '',
    address: '',
    addressLine2: '',
    gstRegistrationDate: ''
  })

  const [businessEntities, setBusinessEntities] = useState([])
  const [currencies, setCurrencies] = useState([])
  const [states, setStates] = useState([])
  const [toast, setToast] = useState(null)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    const fetchDropdownData = async (retryCount = 0) => {
      try {
        const [entities, currencies, states] = await Promise.all([
          clientService.getBusinessEntities(),
          clientService.getCurrencies(),
          clientService.getStates()
        ])
        setBusinessEntities(entities)
        setCurrencies(currencies)
        setStates(states)
      } catch (error) {
        console.error('Error fetching dropdown data:', error)
        if (retryCount < 3) {
          setTimeout(() => fetchDropdownData(retryCount + 1), 10000 * (retryCount + 1))
        }
      }
    }
    fetchDropdownData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleVerifyGSTIN = async () => {
    if (!formData.gstin) {
      setToast({ type: 'error', message: 'Please enter GSTIN' })
      return
    }

    setVerifying(true)
    try {
      const response = await clientService.verifyGSTIN(formData.gstin)
      
      if (response.success) {
        const data = response.data
        const addr = data.pradr?.addr
        
        const stateName = addr?.stcd || ''
        const registrationDate = data.rgdt ? data.rgdt.split('/').reverse().join('-') : ''
        
        setFormData(prev => ({
          ...prev,
          state: stateName,
          gstRegistrationType: data.dty || 'Regular',
          pincode: addr?.pncd || '',
          address: `${addr?.bno || ''} ${addr?.flno || ''} ${addr?.bnm || ''} ${addr?.st || ''}`.trim(),
          addressLine2: `${addr?.loc || ''} ${addr?.dst || ''}`.trim(),
          gstRegistrationDate: registrationDate
        }))
        
        setToast({ type: 'success', message: 'GSTIN verified successfully' })
      } else {
        setToast({ type: 'error', message: response.error || 'Verification failed' })
      }
    } catch (error) {
      setToast({ type: 'error', message: error.message })
    } finally {
      setVerifying(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const selectedEntity = businessEntities.find(e => e.name === formData.businessEntity)
    const selectedCurrency = currencies.find(c => c.code === formData.currency)
    const selectedState = states.find(s => s.name === formData.state)
    
    const payload = {
      client: {
        business_entity: selectedEntity?.id || null,
        business_name: formData.businessName,
        contact_name: formData.contactName,
        contact_number: formData.contactNumber,
        email_id: formData.emailId,
        client_id: formData.clientId,
        currency: selectedCurrency?.id || null,
        client_creation_date: formData.clientCreationDate
      },
      gst_details: [{
        gstin: formData.gstin,
        gst_registration_type: formData.gstRegistrationType,
        gst_registration_date: formData.gstRegistrationDate,
        state: selectedState?.id || null,
        pincode: formData.pincode,
        address: formData.address,
        address_line_2: formData.addressLine2,
        legal_name: formData.businessName,
        is_verified: false
      }]
    }
    
    try {
      const response = await clientService.createClient(payload)
      setToast({ type: 'success', message: response.message || 'Client created successfully' })
      setTimeout(() => navigate('/clients'), 1500)
    } catch (error) {
      console.error('Error saving client:', error)
      setToast({ type: 'error', message: error.message || 'Error occurred' })
    }
  }

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/clients')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button className="p-1 hover:text-gray-800" onClick={() => navigate('/clients')}>
            <ArrowLeft size={20} />
          </button>
          <button className="text-blue-600 hover:underline" onClick={() => navigate('/clients')}>Clients</button>
          <span>›</span>
          <span className="text-gray-800 font-medium">Add Client</span>
        </div>
        <button className="p-2 text-gray-600 hover:text-gray-800">
          <Settings size={20} />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-semibold text-gray-700 mb-6">Add Client</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-8">
            <div>
              <label htmlFor="businessEntity" className="block text-sm text-gray-700 mb-2">
                Business Entity <span className="text-red-500">*</span>
              </label>
              <select
                id="businessEntity"
                name="businessEntity"
                value={formData.businessEntity}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              >
                <option value="">Select..</option>
                {businessEntities.map((entity) => (
                  <option key={entity.id} value={entity.name}>{entity.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm text-gray-700 mb-2">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                placeholder="Business Name"
                value={formData.businessName}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="contactName" className="block text-sm text-gray-700 mb-2">
                Contact Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                placeholder="Contact Name"
                value={formData.contactName}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-sm text-gray-700 mb-2">Contact Number</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                placeholder="Contact Number"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="emailId" className="block text-sm text-gray-700 mb-2">Email ID</label>
              <input
                type="email"
                id="emailId"
                name="emailId"
                placeholder="Email ID"
                value={formData.emailId}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="clientId" className="block text-sm text-gray-700 mb-2">Client ID</label>
              <input
                type="text"
                id="clientId"
                name="clientId"
                placeholder="Client ID"
                value={formData.clientId}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm text-gray-700 mb-2">Currency</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map((curr) => (
                  <option key={curr.id} value={curr.code}>{curr.name} {curr.code} {curr.symbol}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="clientCreationDate" className="block text-sm text-gray-700 mb-2">Client Creation Date</label>
              <input
                type="date"
                id="clientCreationDate"
                name="clientCreationDate"
                value={formData.clientCreationDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="border-b border-gray-200 mb-8">
            <button
              type="button"
              className="text-blue-600 font-medium pb-3 border-b-2 border-blue-600"
            >
              Other Details
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-6">
            <div>
              <label htmlFor="gstin" className="block text-sm text-gray-700 mb-2">GSTIN</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="gstin"
                  name="gstin"
                  placeholder="GSTIN"
                  value={formData.gstin}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
                <button 
                  type="button" 
                  onClick={handleVerifyGSTIN}
                  disabled={!formData.gstin || verifying}
                  className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {verifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="state" className="block text-sm text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {states.map((state) => (
                  <option key={state.id} value={state.name}>{state.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="gstRegistrationType" className="block text-sm text-gray-700 mb-2">GST Registration Type</label>
              <input
                type="text"
                id="gstRegistrationType"
                name="gstRegistrationType"
                value={formData.gstRegistrationType}
                readOnly
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="pincode" className="block text-sm text-gray-700 mb-2">Pincode</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="address" className="block text-sm text-gray-700 mb-2">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="addressLine2" className="block text-sm text-gray-700 mb-2">Address Line 2</label>
              <input
                type="text"
                id="addressLine2"
                name="addressLine2"
                placeholder="Address Line 2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="gstRegistrationDate" className="block text-sm text-gray-700 mb-2">GST Registration Date</label>
              <input
                type="date"
                id="gstRegistrationDate"
                name="gstRegistrationDate"
                placeholder="DD/MM/YYYY"
                value={formData.gstRegistrationDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button 
              type="button" 
              className="px-8 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium" 
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-8 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Save
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddClient