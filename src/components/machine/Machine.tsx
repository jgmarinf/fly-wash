"use client";

import type { BombaData, MachineProps } from '@/interfaces/Machine';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

// Helper function to safely parse string to number
const safeParseInt = (value: string | undefined, defaultValue = 0): number => {
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Define the fetch function for a single machine's shadow (used internally if props not provided)
const fetchMachineDetail = async (thingName: string): Promise<MachineProps> => {
  const res = await fetch(`/api/machines/${thingName}/shadow`); // Assuming shadow endpoint
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
  // Adjust based on actual API response structure if needed
  if (!data) { 
    throw new Error('No data received from API.');
  }
  return data; // Assuming the API directly returns MachineProps structure
};

const Machine = ({ thingName, machineData: propMachineData }: { thingName?: string, machineData?: MachineProps }) => {
  const params = useParams();
  const id = params?.id as string;

  // Fetch machine data internally if not provided via props
  const { data: fetchedMachineData, isLoading, isError, error } = useQuery<MachineProps, Error>({
    queryKey: ['machineDetail', thingName], // Unique key including the thingName
    queryFn: () => fetchMachineDetail(thingName!), // Pass the thingName to the fetch function
    enabled: !propMachineData && !!thingName, // Only run the query if propMachineData is NOT provided AND thingName IS
    retry: 1, // Optional: Limit retries on error
  });

  // Determine the source of truth for data
  const machineData = propMachineData || fetchedMachineData;
  const isCurrentlyLoading = !propMachineData && isLoading;
  const currentError = !propMachineData ? error : null; // Only consider internal fetch error if props aren't used

  // Handle essential missing data or loading/error states
  if (!thingName) {
    return <div className="bg-gray-800 text-red-500 p-4 rounded-lg shadow-lg w-64 h-[405px] mx-auto flex flex-col justify-center items-center font-mono border-2 border-red-700">Error: Thing name is missing.</div>;
  }
  if (isCurrentlyLoading) {
    // Loading state specifically for when fetching internally
    return <div className="bg-gray-800 text-gray-400 p-4 rounded-lg shadow-lg w-64 h-[405px] mx-auto flex flex-col justify-center items-center font-mono border-2 border-gray-700 animate-pulse">Loading data...</div>;
  }
  if (isError && currentError) {
    // Error state specifically for when fetching internally
    return <div className="bg-gray-800 text-red-500 p-4 rounded-lg shadow-lg w-64 h-[405px] mx-auto flex flex-col justify-center items-center font-mono border-2 border-red-700">Error: {currentError.message}</div>;
  }
  if (!machineData) {
    // This case handles if props weren't passed AND internal fetch hasn't completed/succeeded yet, or failed silently
    return <div className="bg-gray-800 text-gray-400 p-4 rounded-lg shadow-lg w-64 h-[405px] mx-auto flex flex-col justify-center items-center font-mono border-2 border-gray-700">Machine data not available...</div>;
  }

  // Calculate derived values using the determined machineData
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
  
  // Check if any bomba needs a warning
  const showWarningBell = bombas.some(bomba => 
    safeParseInt(bomba.CountSale) >= safeParseInt(bomba.CountWarning)
  );

  const handleVentaRemota = async (bomba: BombaData & { key: string }) => {
    if (id === thingName) {
      const confirm = window.confirm("¿Seguro deseas hacer esta venta remota?");
      if (confirm) {
        try {
          const response = await fetch('/api/ventaRemota', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              thingName: thingName,
              bombaKey: bomba.key
            }),
          });

          if (!response.ok) {
            throw new Error('Error en la solicitud');
          }
          console.log("Venta remota exitosa");
        } catch (err) {
          console.error('Error:', err);
          alert('Error al procesar la venta remota');
        }
      }
    }
  };



  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-64 mx-auto flex flex-col items-center font-mono border-2 border-gray-700 hover:shadow-blue-900">
      {/* LCD Screen */}
      <div className="bg-green-900 border border-green-700 rounded p-3 mb-4 w-full text-sm">
        
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
          {/* Conditionally render the warning bell */}
          {showWarningBell && (
            <span className="text-yellow-500">🔔</span>
          )}
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
            onClick={() => handleVentaRemota(bomba)}
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
