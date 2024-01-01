import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from './components/admin';
import { User } from './components/User';
function App() {

  return (
    <BrowserRouter>
    <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<User />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
