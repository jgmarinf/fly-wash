"use client"; // Add this directive for hooks

import Machine from "@/components/machine/Machine";
import { useParams, useRouter } from 'next/navigation'; // Import useParams and useRouter


const MachineDetailPage = () => {
  const params = useParams();
  const router = useRouter(); // Get router instance
  const id = params?.id; // Get the id from params
  
  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full h-screen bg-blue-950"> {/* Added flex-col, items-center, padding, background */}
      <button
        onClick={() => router.push('/')} // Navigate to dashboard
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-start mb-4" // Added styling and margin
      >
        &larr; Volver al Dashboard {/* Back arrow and text */}
      </button>
      <Machine thingName={id as string} />
    </div>
  )
}

export default MachineDetailPage
