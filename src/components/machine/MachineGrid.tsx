"use client";

import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { useRouter } from 'next/navigation';
import { Suspense } from 'react'; // Import Suspense
import Machine from "./Machine";

// Define an interface for the Thing object based on the expected response
interface Thing {
  thingName?: string;
  thingArn?: string;
  attributes?: Record<string, string>;
  version?: number;
  thingTypeName?: string | null;
}

// Define the fetch function
const fetchMachines = async (): Promise<Thing[]> => {
  const res = await fetch('/api/machines');
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data || []; // Return empty array if data is null/undefined
};

// Define a simple skeleton/loading component for the fallback
const MachineSkeleton = () => (
  <div className="bg-gray-700 animate-pulse p-4 rounded-lg shadow-lg w-64 h-[405px] mx-auto flex flex-col items-center justify-center font-mono border-2 border-gray-600">
    Loading Machine...
  </div>
);

const MachineGrid = () => {
  const router = useRouter();

  // Use TanStack Query to fetch the list of machines
  const { data: things, isLoading, error } = useQuery<Thing[], Error>({
    queryKey: ['machines'], // Unique key for this query
    queryFn: fetchMachines, // The function to fetch data
  });

  // Still handle loading and error for the initial list fetch
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen text-white">Loading machine list...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error fetching machine list: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-blue-950 min-h-screen">
      {things && things.length > 0 ? (
        [...things].reverse().map((thing) => (
          <Suspense key={thing.thingName} fallback={<MachineSkeleton />}>
            <div
              onClick={() => router.push(`/machine/${thing.thingName}`)} // Navigate on click
              className="cursor-pointer" // Add cursor pointer for better UX
            >
              <Machine
                thingName={thing.thingName} // Pass the thingName
              />
            </div>
          </Suspense>
        ))
      ) : (
        <div className="col-span-full text-center text-white">No machines found.</div>
      )}
    </div>
  );
}

export default MachineGrid;
