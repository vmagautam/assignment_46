import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import clientService from '../services/clientService'
import Toast from './Toast'
import ConfirmModal from './ConfirmModal'

const ClientsList = () => {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, clientId: null })

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const response = await clientService.getClients(currentPage, itemsPerPage)
        setClients(response.data || [])
        setTotalPages(response.pagination?.totalPages || 0)
        setTotalCount(response.pagination?.total || 0)
      } catch (error) {
        console.error('Error fetching clients:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchClients()
  }, [currentPage, itemsPerPage])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleAddClient = () => {
    navigate('/add-client')
  }

  const handleViewClient = (clientId) => {
    navigate(`/view-client/${clientId}`)
  }

  const handleEditClient = (clientId) => {
    navigate(`/edit-client/${clientId}`)
  }

  const handleDeleteClick = (clientId) => {
    setDeleteModal({ isOpen: true, clientId })
  }

  const handleDeleteConfirm = async () => {
    try {
      await clientService.deleteClient(deleteModal.clientId)
      setClients(prev => prev.filter(client => client.id !== deleteModal.clientId))
      setToast({ type: 'success', message: 'Client deleted successfully' })
    } catch (error) {
      console.error('Error deleting client:', error)
      setToast({ type: 'error', message: error.message || 'Failed to delete client' })
    } finally {
      setDeleteModal({ isOpen: false, clientId: null })
    }
  }

  const filteredClients = searchTerm
    ? clients.filter(client =>
        client.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.client_id?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : clients

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage
  const indexOfLastItem = currentPage * itemsPerPage

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, clientId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
      />
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Clients</h1>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            onClick={handleAddClient}
          >
            <Plus size={20} />
            Add Client
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading clients...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GSTIN</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{client.business_name}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{client.contact_name}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{client.contact_number}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{client.email_id}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{client.client_id}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{client.state}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{client.gstin}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{new Date(client.client_creation_date).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                onClick={() => handleViewClient(client.id)}
                                title="View Client"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                onClick={() => handleEditClient(client.id)}
                                title="Edit Client"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                onClick={() => handleDeleteClick(client.id)}
                                title="Delete Client"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                          {searchTerm ? 'No clients found matching your search.' : 'No clients found. Add your first client!'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {!searchTerm && totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalCount)} of {totalCount} entries
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                        <button
                          key={pageNumber}
                          className={`px-3 py-1.5 text-sm rounded-md ${
                            currentPage === pageNumber
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      ))}
                    </div>

                    <button
                      className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClientsList