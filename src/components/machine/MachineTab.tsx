"use client";

import { useDownload } from '@/hooks/useDownLoad'; // Import the custom hook
import type { BombaData, MachineProps } from '@/interfaces/Machine';
import { useEffect, useState } from 'react'; // Import useState and useEffect

interface MachineTabProps {
  machineData: MachineProps;
  thingName: string | undefined; // Add thingName prop
}
type EditedData = {
  [key: string]: Partial<BombaData>; // Store partial updates per bomba key
};
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


const MachineTab = ({ machineData, thingName }: MachineTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<EditedData>({});

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

  // Initialize or reset editedData when bombas data changes
  useEffect(() => {
    const initialEditData: EditedData = {};
    bombas.forEach(bomba => {
      initialEditData[bomba.key] = { ...bomba }; // Initialize with current data
    });
    setEditedData(initialEditData);
  }, [machineData]); // Rerun when machineData changes

  // Use the custom hook to get the download function - Moved up to avoid conditional call
  const { downloadExcel } = useDownload(machineData, thingName); // Pass thingName to the hook

  if (bombas.length === 0) {
    return <div className="text-white p-4">No hay datos de bombas disponibles.</div>;
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset changes if cancelling
      const initialEditData: EditedData = {};
      bombas.forEach(bomba => {
        initialEditData[bomba.key] = { ...bomba };
      });
      setEditedData(initialEditData);
    }
    setIsEditing(!isEditing);
  };

  const handleSend = () => {
    const changes: EditedData = {};
    const originalReported = machineData?.state?.reported || {};

    Object.keys(editedData).forEach(bombaKey => {
      const originalBomba = originalReported[bombaKey] as BombaData | undefined;
      const editedBomba = editedData[bombaKey];
      const bombaChanges: Partial<BombaData> = {};

      if (originalBomba && editedBomba) {
        (Object.keys(editedBomba) as Array<keyof BombaData>).forEach(field => {
          // Compare edited value with original value
          // Note: Direct comparison works for strings. Consider type coercion if needed.
          if (editedBomba[field] !== originalBomba[field]) {
            bombaChanges[field] = editedBomba[field];
          }
        });
      }

      if (Object.keys(bombaChanges).length > 0) {
        changes[bombaKey] = bombaChanges;
      }
    });

    if (Object.keys(changes).length > 0) {
      console.log(changes);
      // Here you would typically send 'changes' to your API
    } else {
      console.log("No se detectaron cambios para enviar.");
    }

    setIsEditing(false);
    // Reset editedData to reflect the 'sent' state (or refetch)
    // For now, we keep the edited state until next data load or cancel
  };

  const handleInputChange = (bombaKey: string, field: keyof BombaData, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [bombaKey]: {
        ...prev[bombaKey],
        [field]: value
      }
    }));
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg w-full max-w-3xl font-mono text-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-center ">
            <th className="p-2 bg-cyan-800 rounded-lg text-white">BOMBA NAME</th>  
            <th className="p-2 bg-purple-700 rounded-lg text-white">TIEMPO</th>
            <th className="p-2 bg-yellow-700 rounded-lg text-white">COSTO</th>
            <th className="p-2 bg-gray-500 rounded-lg text-white">CANTIDAD PRODUCTO</th>
            <th className="p-2 bg-orange-600 rounded-lg text-white"># VENTAS</th>
            <th className="p-2 bg-green-600 rounded-lg text-white">VENTAS</th>
          </tr>
        </thead>
        <tbody>
          {bombas.map((bomba, index) => {
            const currentEdit = editedData[bomba.key] || {}; // Get edited data for this bomba
            const tiempo = currentEdit.TimeCycle || 'N/A';
            const costoStr = currentEdit.CreditCost || '0';
            const cantidadStr = currentEdit.CountLimit || '0';
            const numVentasStr = currentEdit.CountSale || '0';

            // Parse for calculations/display formatting
            const costo = safeParseInt(costoStr);
            const cantidad = safeParseInt(cantidadStr);
            const numVentas = safeParseInt(numVentasStr);
            const ventasTotal = numVentas * costo;

            return (
              <tr key={bomba.key} className="text-center">
                <td className="p-2"><span className="bg-blue-600 text-white px-3 py-1 rounded-lg block">{`Bomba ${index + 1}`}</span></td>
                <td className="p-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={tiempo === 'N/A' ? '' : tiempo} // Handle N/A case
                      onChange={(e) => handleInputChange(bomba.key, 'TimeCycle', e.target.value)}
                      className="bg-gray-700 text-white p-1 rounded w-full text-center"
                      placeholder="Tiempo"
                    />
                  ) : (
                    <span className="bg-pink-500 text-white px-3 py-1 rounded-lg block">{tiempo}</span>
                  )}
                </td>
                <td className="p-2">
                  {isEditing ? (
                    <input
                      type="number"
                      value={costoStr}
                      onChange={(e) => handleInputChange(bomba.key, 'CreditCost', e.target.value)}
                      className="bg-gray-700 text-white p-1 rounded w-full text-center"
                      placeholder="Costo"
                    />
                  ) : (
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-lg block">{formatNumber(costo)} $</span>
                  )}
                </td>
                <td className="p-2">
                  {isEditing ? (
                    <input
                      type="number"
                      value={cantidadStr}
                      onChange={(e) => handleInputChange(bomba.key, 'CountLimit', e.target.value)}
                      className="bg-gray-700 text-white p-1 rounded w-full text-center"
                      placeholder="Cantidad"
                    />
                  ) : (
                    <span className="bg-gray-400 text-black px-3 py-1 rounded-lg block">{cantidad}</span>
                  )}
                </td>
                <td className="p-2">
                  {isEditing ? (
                    <input
                      type="number"
                      value={numVentasStr} // Use numVentasStr which is currentEdit.CountSale
                      onChange={(e) => handleInputChange(bomba.key, 'CountSale', e.target.value)}
                      className="bg-gray-700 text-white p-1 rounded w-full text-center"
                      placeholder="# Ventas"
                    />
                  ) : (
                    <span className="bg-orange-400 text-black px-3 py-1 rounded-lg block">{numVentas}</span>
                  )}
                </td>
                <td className="p-2"><span className="bg-green-400 text-black px-3 py-1 rounded-lg block">{formatNumber(ventasTotal)} $</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={downloadExcel} // Use the function from the hook
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 active:bg-blue-800 disabled:opacity-50"
          disabled={isEditing} // Disable download when editing
        >
          Descargar Estado
        </button>
        <button
          onClick={handleEditToggle}
          className={`${isEditing ? 'bg-red-600 hover:bg-red-700 active:bg-red-800' : 'bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800'} text-white font-bold py-2 px-4 rounded transition-colors duration-200`}
        >
          {isEditing ? 'Cancelar' : 'Modificar'}
        </button>
        {isEditing && (
          <button
            onClick={handleSend}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 active:bg-green-800"
          >
            Enviar
          </button>
        )}
      </div>
    </div>
  );
};

export default MachineTab;
