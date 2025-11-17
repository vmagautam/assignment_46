import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

class ClientService {
  async getClients(page = 1, limit = 10) {
    try {
      const response = await axios.get(`${BASE_URL}/client`, {
        params: { page, limit }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching clients:', error)
      throw error
    }
  }

  async getClientById(id) {
    try {
      const response = await axios.get(`${BASE_URL}/client/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching client:', error)
      throw error
    }
  }

  async createClient(clientData) {
    try {
      const response = await axios.post(`${BASE_URL}/client`, clientData)
      return response.data
    } catch (error) {
      console.error('Error creating client:', error)
      throw new Error(error.response?.data?.error || error.message)
    }
  }

  async updateClient(id, clientData) {
    try {
      const response = await axios.put(`${BASE_URL}/client/${id}`, clientData)
      return response.data
    } catch (error) {
      console.error('Error updating client:', error)
      throw new Error(error.response?.data?.error || error.message)
    }
  }

  async deleteClient(id) {
    try {
      const response = await axios.delete(`${BASE_URL}/client/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting client:', error)
      throw error
    }
  }

  async verifyGSTIN(gstin) {
    try {
      const response = await axios.post(`${BASE_URL}/gstin/verify`, { gstin })
      return response.data
    } catch (error) {
      console.error('Error verifying GSTIN:', error)
      throw new Error(error.response?.data?.error || 'Failed to verify GSTIN')
    }
  }

  async getBusinessEntities() {
    try {
      const response = await axios.get(`${BASE_URL}/business-entity`)
      return response.data
    } catch (error) {
      console.error('Error fetching business entities:', error)
      throw error
    }
  }

  async getCurrencies() {
    try {
      const response = await axios.get(`${BASE_URL}/currency`)
      return response.data
    } catch (error) {
      console.error('Error fetching currencies:', error)
      throw error
    }
  }

  async getStates() {
    try {
      const response = await axios.get(`${BASE_URL}/states`)
      return response.data
    } catch (error) {
      console.error('Error fetching states:', error)
      throw error
    }
  }
}

// Export singleton instance
export default new ClientService()
