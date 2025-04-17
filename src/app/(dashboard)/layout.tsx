"use client"

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="min-h-screen">
      <nav className="bg-gray-800 p-4">
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
      <div className="">{children}</div>
    </div>
  );
}
