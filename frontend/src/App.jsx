import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ClientsList from './components/ClientsList'
import AddClient from './components/AddClient'
import EditClient from './components/EditClient'
import ViewClient from './components/ViewClient'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientsList />} />
        <Route path="/clients" element={<ClientsList />} />
        <Route path="/add-client" element={<AddClient />} />
        <Route path="/edit-client/:id" element={<EditClient />} />
        <Route path="/view-client/:id" element={<ViewClient />} />
      </Routes>
    </Router>
  )
}

export default App
