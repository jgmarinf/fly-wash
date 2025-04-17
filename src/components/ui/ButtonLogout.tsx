"use client"

const ButtonLogout = () => {
    const handleLogout = async () => {
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
          });
          window.location.href = '/auth/login';
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        }
      };
  return (
    <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Cerrar sesión
          </button>
  )
}

export default ButtonLogout
