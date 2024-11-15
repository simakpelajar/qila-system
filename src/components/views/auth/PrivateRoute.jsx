import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../../utils/auth'; // Fungsi untuk mengecek autentikasi

const PrivateRoute = ({ children }) => {
  const auth = isAuthenticated();  // Mengecek apakah pengguna terautentikasi

  // Jika tidak terautentikasi, redirect ke halaman login
  if (!auth) {
    return <Navigate to="/signin" />;
  }

  // Jika terautentikasi, tampilkan konten
  return children;
};

export default PrivateRoute;
