"use client"; // Add this directive for hooks

import Machine from "@/components/machine/Machine";
import { useParams } from 'next/navigation'; // Import useParams


const MachineDetailPage = () => {
  const params = useParams();
  const id = params?.id; // Get the id from params
  
  return (
    <div className="flex gap-2 w-full h-screen ">
      <Machine thingName={id as string} />
    </div>
  )
}

export default MachineDetailPage
