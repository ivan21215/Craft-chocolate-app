import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ChocolateDetails from './pages/ChocolateDetails';
import Manufacturers from './pages/Manufacturers';
import ManufacturerDetails from './pages/ManufacturerDetails';
import ChocolateForm from './pages/ChocolateForm';
import ManufacturerForm from './pages/ManufacturerForm';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/chocolates/:id" element={<ChocolateDetails />} />
              <Route path="/manufacturers" element={<Manufacturers />} />
              <Route path="/manufacturers/:id" element={<ManufacturerDetails />} />
            </Route>

            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="/chocolates/new" element={<ChocolateForm />} />
              <Route path="/chocolates/:id/edit" element={<ChocolateForm />} />
              <Route path="/manufacturers/new" element={<ManufacturerForm />} />
              <Route path="/manufacturers/:id/edit" element={<ManufacturerForm />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
