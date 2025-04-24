"use client";


import { useEffect, useState } from 'react';
import Machine from "./Machine";

// Define an interface for the Thing object based on the expected response
interface Thing {
  thingName?: string;
  thingArn?: string;
  attributes?: Record<string, string>;
  version?: number;
  thingTypeName?: string | null;
}

const MachineGrid = () => {
  const [things, setThings] = useState<Thing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/machines');
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setThings(data || []);
      } catch (err) {
        console.error("Error fetching machines from API:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch machines. Please check console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchThings();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-white">Loading machines...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-blue-950 min-h-screen">
      {things.length > 0 ? (
        things.map((thing) => (
          // Assuming Machine component will need the thing details
          // Pass the whole thing object or specific properties as needed
          <Machine 
            key={thing.thingName} 
            thingName={thing.thingName} // Pass the thing object as a prop
          />
        ))
      ) : (
        <div className="col-span-full text-center text-white">No machines found.</div>
      )}
    </div>
  );
}

export default MachineGrid;
