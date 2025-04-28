"use client";

import type { BombaData, MachineProps } from '@/interfaces/Machine';

// Helper function to safely parse string to number
const safeParseInt = (value: string | undefined, defaultValue = 0): number => {
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Helper function to format numbers with dots as thousands separators
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

interface MachineTabProps {
  machineData: MachineProps;
}

const MachineTab = ({ machineData }: MachineTabProps) => {
  const reportedState = machineData?.state?.reported;
  const bombas = reportedState
    ? Object.entries(reportedState)
        .filter(([key, value]) => key.startsWith('Bomba_') && typeof value === 'object' && value !== null)
        .sort(([keyA], [keyB]) => { // Sort bombas numerically by their index
          const indexA = parseInt(keyA.split('_')[1] || '0', 10);
          const indexB = parseInt(keyB.split('_')[1] || '0', 10);
          return indexA - indexB;
        })
        .map(([key, value]) => ({ key, ...(value as BombaData) }))
    : [];

  if (bombas.length === 0) {
    return <div className="text-white p-4">No hay datos de bombas disponibles.</div>;
  }

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg w-full max-w-3xl font-mono text-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-center ">
            <th className="p-2 bg-cyan-800 rounded-lg text-white">BOMBA NAME</th> {/* Empty header for Bomba name column */} 
            <th className="p-2 bg-purple-700 rounded-lg text-white">TIEMPO</th>
            <th className="p-2 bg-yellow-700 rounded-lg text-white">COSTO</th>
            <th className="p-2 bg-gray-500 rounded-lg text-white">CANTIDAD PRODUCTO</th>
            <th className="p-2 bg-orange-600 rounded-lg text-white"># VENTAS</th>
            <th className="p-2 bg-green-600 rounded-lg text-white">VENTAS</th>
          </tr>
        </thead>
        <tbody>
          {bombas.map((bomba, index) => {
            const tiempo = bomba.TimeCycle || 'N/A';
            const costo = safeParseInt(bomba.CreditCost);
            const cantidad = safeParseInt(bomba.CountLimit); // Assuming CountLimit is product quantity
            const numVentas = safeParseInt(bomba.CountSale);
            const ventasTotal = numVentas * costo;

            return (
              <tr key={bomba.key} className="text-center">
                <td className="p-2"><span className="bg-blue-600 text-white px-3 py-1 rounded-lg block">{`Bomba ${index + 1}`}</span></td>
                <td className="p-2"><span className="bg-pink-500 text-white px-3 py-1 rounded-lg block">{tiempo}</span></td>
                <td className="p-2"><span className="bg-yellow-500 text-black px-3 py-1 rounded-lg block">{formatNumber(costo)} $</span></td>
                <td className="p-2"><span className="bg-gray-400 text-black px-3 py-1 rounded-lg block">{cantidad}</span></td>
                <td className="p-2"><span className="bg-orange-400 text-black px-3 py-1 rounded-lg block">{numVentas}</span></td>
                <td className="p-2"><span className="bg-green-400 text-black px-3 py-1 rounded-lg block">{formatNumber(ventasTotal)} $</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MachineTab;
