"use client"; // Add this directive for hooks

import Machine from "@/components/machine/Machine";
import ButtonDashboard from "@/components/ui/ButtonDashboard";
import { useParams } from 'next/navigation'; // Import useParams and useRouter


const MachineDetailPage = () => {
  const params = useParams();
  const id = params?.id; // Get the id from params
  
  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full min-h-screen bg-blue-950 overflow-auto"> {/* Added flex-col, items-center, padding, background */}
      <ButtonDashboard/>
      <Machine thingName={id as string} />
    </div>
  )
}

export default MachineDetailPage
