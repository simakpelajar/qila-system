
export const isAuthenticated = () => {
    const token = localStorage.getItem('token'); // Mengambil token dari localStorage
    return !!token;  // Return true jika token ada, false jika tidak ada
  };
  