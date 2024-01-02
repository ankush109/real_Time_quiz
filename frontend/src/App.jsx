import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster, toast, useToasterStore } from "react-hot-toast";
import Admin from './components/admin';
import { User } from './components/User';
import { useEffect } from 'react';
import Navbar from './components/Navbar';

function App() {
  const MAX_TOAST_LIMIT = 1;
  const { toasts } = useToasterStore();
  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= MAX_TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  return (
    <><Toaster
      position="bottom-right"
      reverseOrder={false}
      toastOptions={{ duration: 6000 }} /><BrowserRouter>
           <Navbar/>
        <Routes>
       
          <Route path="/admin" element={<Admin />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </BrowserRouter></>
  )
}

export default App
