

"use client";

import type { BombaData, MachineProps } from '@/interfaces/Machine';
import { useQuery } from '@tanstack/react-query';

// Helper function to safely parse string to number
const safeParseInt = (value: string | undefined, defaultValue = 0): number => {
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Define the fetch function for a single machine's shadow
const fetchMachineData = async (thingName: string): Promise<MachineProps> => {
  const res = await fetch(`/api/machines/${thingName}/shadow`);
  if (!res.ok) {
    const errorData = await res.json();
    // Throwing an error here will be caught by the nearest ErrorBoundary or Suspense error handling
    throw new Error(errorData.error || `Failed to fetch shadow: ${res.statusText}`);
  }
  const data: MachineProps = await res.json();
  if (!data) {
    // Handle cases where the API returns ok but no data, maybe throw specific error
    throw new Error('No data received from API.');
  }
  return data;
};

const Machine = ({ thingName }: { thingName?: string }) => {

  // Use TanStack Query to fetch machine data.
  // Call the hook unconditionally at the top level.
  const { data: machineData } = useQuery<MachineProps, Error>({
    queryKey: ['machine', thingName], // Unique key including the thingName
    queryFn: () => fetchMachineData(thingName!), // Pass the fetch function, assert thingName exists due to enabled flag
    enabled: !!thingName, // Ensure query runs only when thingName is valid. This handles the conditional logic.
    // suspense: true, // Explicitly enable suspense if needed (usually default in v5+)
    staleTime: 5 * 60 * 1000, // Example: 5 minutes stale time
  });

  // Handle case where thingName is not provided early
  // This check remains, but after the hook call.
  if (!thingName) {
    // Consider a more specific error display or null render
    return <div className="bg-gray-800 text-red-500 p-4 rounded-lg shadow-lg w-64 h-[405px] mx-auto flex flex-col justify-center items-center font-mono border-2 border-red-700">Error: Thing name is not provided.</div>;
  }

  // Loading and error states are now handled by Suspense boundary in the parent component.
  // The component will only render when data is successfully fetched.

  // Calculate derived values (moved inside the component body)
  const reportedState = machineData?.state?.reported;
  const bombas = reportedState
    ? Object.entries(reportedState)
        .filter(([key, value]) => key.startsWith('Bomba_') && typeof value === 'object' && value !== null)
        .map(([key, value]) => ({ key, ...(value as BombaData) }))
    : [];

  const ventas = bombas.reduce((sum, bomba) => {
    const countSale = safeParseInt(bomba.CountSale);
    const creditCost = safeParseInt(bomba.CreditCost);
    return sum + (countSale * creditCost);
  }, 0);

  const registros = bombas.reduce((sum, bomba) => {
    const countSale = safeParseInt(bomba.CountSale);
    return sum + countSale;
  }, 0);

  const firstBomba = bombas.length > 0 ? bombas[0] : null;
  const isEnabled = firstBomba?.isEnable === '1';
  const warnings = safeParseInt(firstBomba?.CountWarning);
  const timeCycle = firstBomba?.TimeCycle ? `${firstBomba.TimeCycle}s` : 'N/A';

  // Removed isLoading and isError checks as Suspense handles them.

  // The component now assumes machineData is available when rendering.
  // A check for !machineData might still be useful for robustness if the API could return null/undefined successfully.
  // However, fetchMachineData now throws an error if data is null, so this check is less critical.
  // if (!machineData) {
  //    return <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-64 h-[405px] mx-auto flex justify-center items-center font-mono border-2 border-gray-700">No data available.</div>;
  // }

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-64 h-[405px] mx-auto flex flex-col items-center font-mono border-2 border-gray-700 hover:shadow-blue-900">
      {/* LCD Screen */}
      <div className="bg-green-900 border border-green-700 rounded p-3 mb-4 w-full text-sm">
        <div className="flex justify-between mb-1">
          {timeCycle}
        </div>
        <div className="text-center text-2xl font-bold my-2">
          <span>Ventas: ${ventas}</span>
        </div>
        <div className="flex justify-between">
          <span>Registros: {registros}</span>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex justify-between items-center w-full mb-4 px-2">
        <div className="flex items-center">
          <span className={`h-3 w-3 rounded-full mr-2 ${isEnabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>{isEnabled ? 'Habilitada' : 'Deshabilitada'}</span>
        </div>
        <div className="flex items-center">
          <span className="text-yellow-500">🔔</span>
          <span className="ml-1">{warnings}</span>
        </div>
      </div>

      {/* Thing Name Display */}
      <div className="bg-gray-700 p-2 rounded mb-4 w-full text-center">
        <h3 className="text-lg font-semibold">{thingName /* Already checked for existence */}</h3>
      </div>

      {/* Dynamic Buttons Grid */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {bombas.map((bomba) => (
          <button
            key={bomba.key} // Use the Bomba_X key
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors duration-200 active:bg-gray-700"
          >
            {/* Display B1, B2 etc. from Bomba_1, Bomba_2 */}
            {`B${bomba.key.split('_')[1]}`}
          </button>
        ))}
        {/* Optional: Add placeholders if needed to fill the grid */}
        {[...Array(Math.max(0, 8 - bombas.length))].map((_, index) => (
            <div key={`placeholder-${index}`} className="col-span-1"></div>
        ))}
      </div>
    </div>
  );
};

export default Machine;
