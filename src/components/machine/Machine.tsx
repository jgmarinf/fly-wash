import { MachineProps } from "@/interfaces/Machine";



const Machine = ({ data }: MachineProps) => {
  return (
    <div className="relative bg-gray-800 rounded-lg p-6 w-64 h-52 shadow-2xl transform perspective-1000 rotate-x-6">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg shadow-inner" />
      {/* Pantalla LCD */}
      <div className="relative z-10 bg-green-900 rounded-lg p-3 mb-4 h-32 font-mono text-green-300">
        <div className="flex justify-between text-sm">
          <span>Ventas: 12</span>
          <span>Crédito: $5000</span>
        </div>
        <div className="text-center mt-2 text-xl">
          20s
        </div>
        <div className="mt-2 text-xs flex justify-between">
          <span>Registros: 10</span>
          <span>Límite: 2</span>
        </div>
      </div>
      {/* Estado y advertencias */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${data.isEnable === '1' ? 'bg-green-500' : 'bg-red-500'} shadow-inner`} />
          <span className="text-sm text-gray-300">Habilitada</span>
        </div>
        <div className="flex items-center text-yellow-400 text-sm">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          2
        </div>
      </div>
      {/* Panel de control simulado */}
      <div className="relative z-10 grid grid-cols-3 gap-2 mt-6">
        
      </div>

      {/* Detalles de diseño 3D */}
      <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-gray-900 to-transparent rounded-l-lg" />
      <div className="absolute inset-y-0 right-0 w-2 bg-gradient-to-l from-gray-900 to-transparent rounded-r-lg" />
    </div>
  );
};

export default Machine;
