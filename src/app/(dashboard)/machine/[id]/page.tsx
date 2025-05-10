"use client"; // Add this directive for hooks

import Machine from "@/components/machine/Machine";
import MachineTab from "@/components/machine/MachineTab";
import ButtonDashboard from "@/components/ui/ButtonDashboard";
import ButtonSendMoney from "@/components/ui/ButtonSendMoney";
import type { MachineProps } from '@/interfaces/Machine'; // Import the interface
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { useParams } from 'next/navigation'; // Import useParams

// Define the fetch function for machine details (can be outside the component)
const fetchMachineDetail = async (thingName: string): Promise<MachineProps> => {
  // Assuming your API endpoint structure is /api/machines/[thingName]/shadow
  const res = await fetch(`/api/machines/${thingName}/shadow`); 
  if (!res.ok) {
    let errorMsg = `HTTP error! status: ${res.status}`;
    try {
      const errorData = await res.json();
      errorMsg = errorData.error || errorMsg;
    } catch {
      // Ignore if response is not JSON
    }
    throw new Error(errorMsg);
  }
  const data = await res.json();
  // Adjust this based on the actual structure of your API response
  if (!data) {
    throw new Error('No data received from API.');
  }
  return data;
};

const MachineDetailPage = () => {
  const params = useParams();
  const id = params?.id as string; // Get the id from params, assert as string

  // Fetch machine data using useQuery
  const { data: machineData, isLoading, error, isError } = useQuery<MachineProps, Error>({
    queryKey: ['machineDetail', id], // Unique key including the id
    queryFn: () => fetchMachineDetail(id), // Pass the id to the fetch function
    enabled: !!id, // Only run the query if id is available
    retry: 1, // Optional: Limit retries on error
  });
  
  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full min-h-screen bg-blue-950 overflow-auto"> {/* Added flex-col, items-center, padding, background */}
      <div className="flex justify-center gap-2 max-sm:flex-col">
      <ButtonDashboard/>
      <ButtonSendMoney/>
      </div>
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 w-full mx-auto"> {/* Adjusted layout for side-by-side */} 
        {isLoading && <div className="text-white text-center py-10">Loading machine details...</div>}
        {isError && <div className="text-red-500 text-center py-10">Error loading machine: {error?.message || 'Unknown error'}</div>}
        {!isLoading && !isError && !id && <div className="text-red-500 text-center py-10">Machine ID is missing from the URL.</div>}
        {!isLoading && !isError && id && !machineData && (
          <div className="text-white text-center py-10">Machine data not found for {id}. It might not exist or the API endpoint is incorrect.</div>
        )}
        {/* Render components only if data is successfully loaded */} 
        {machineData && id && (
          <>
            <Machine thingName={id} machineData={machineData} />
            <MachineTab machineData={machineData} thingName={id} />
          </>
        )}
      </div>
    </div>
  )
}

export default MachineDetailPage
