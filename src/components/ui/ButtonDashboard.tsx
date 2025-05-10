"use client"

import { useRouter } from "next/navigation";

const ButtonDashboard = () => {
  const router = useRouter(); // Get router instance

  return (
    <button
        onClick={() => router.push('/')} // Navigate to dashboard
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-max py-2 px-4 rounded self-start mb-5" // Added styling and margin
      >
       Volver al Dashboard {/* Back arrow and text */}
      </button>
  )
}

export default ButtonDashboard
