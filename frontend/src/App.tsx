import './App.css'
import HomePage from './pages/HomePage'
import VehiclePage from './pages/VehiclePage'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vehicle/:license" element={<VehiclePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
