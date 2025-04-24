




const Machine = ({ thingName }: { thingName?: string }) => {
  // Hardcoded data for visual representation based on the image
  const ventas = 0;
  const credito = '$1';
  const registros = 0;
  const limite = 20;
  const isEnabled = true; // Represents 'Habilitada'
  const warnings = 5; // Represents the number next to the bell icon
  const timeCycle = '10s'; // Hardcoded time

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-64 h-[405px] mx-auto flex flex-col items-center font-mono border-2 border-gray-700">
      {/* Simulated LCD Screen */}
      <div className="bg-green-900 border border-green-700 rounded p-3 mb-4 w-full text-sm">
        <div className="flex justify-between mb-1">
          <span>Ventas: {ventas}</span>
          <span>Crédito: {credito}</span>
        </div>
        <div className="text-center text-3xl font-bold my-2">
          {timeCycle}
        </div>
        <div className="flex justify-between">
          <span>Registros: {registros}</span>
          <span>Límite: {limite}</span>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex justify-between items-center w-full mb-4 px-2">
        <div className="flex items-center">
          <span className={`h-3 w-3 rounded-full mr-2 ${isEnabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>{isEnabled ? 'Habilitada' : 'Deshabilitada'}</span>
        </div>
        <div className="flex items-center">
          {/* Using a simple bell icon representation */}
          <span className="text-yellow-500">🔔</span>
          <span className="ml-1">{warnings}</span>
        </div>
      </div>

      {/* Thing Name Display (Moved below LCD for better fit) */}
      <div className="bg-gray-700 p-2 rounded mb-4 w-full text-center">
        <h3 className="text-lg font-semibold">{thingName ? thingName : "Machine ID"}</h3>
      </div>

      {/* Numeric Buttons Grid */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
          <button
            key={`B${num}`}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors duration-200 active:bg-gray-700"
          >
            {`B${num}`}
          </button>
        ))}
        {/* Add empty cells or adjust grid if needed for layout */}
        {/* Example: Add a placeholder for the 9th spot if using 3x3 */}
         <div className="col-span-1"></div> {/* Placeholder or adjust as needed */} 
      </div>
    </div>
  );
};

export default Machine;
