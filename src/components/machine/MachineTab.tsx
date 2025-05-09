"use client";

import { useDownload } from '@/hooks/useDownLoad';
// Renombramos BombaData importada a ShadowBombaFields para indicar que son los campos del shadow
import type { MachineProps, BombaData as ShadowBombaFields } from '@/interfaces/Machine';
import { useEffect, useState } from 'react';

// Este es el tipo de objeto que realmente manejamos en el estado 'editedData' y en el array 'bombas'
// Incluye la 'key' (nombre de la bomba, ej: "Bomba_1") como una propiedad interna.
type ComponentBomba = ShadowBombaFields & { key: string };

interface MachineTabProps {
  machineData: MachineProps;
  thingName: string | undefined;
}

// El payload de cambios solo debe contener los campos de ShadowBombaFields
type ChangesPayload = {
  [bombaKey: string]: Partial<ShadowBombaFields>;
};

const safeParseInt = (value: string | undefined, defaultValue = 0): number => {
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const MachineTab = ({ machineData, thingName }: MachineTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  // editedData almacenará objetos del tipo ComponentBomba
  const [editedData, setEditedData] = useState<{ [bombaId: string]: ComponentBomba }>({});

  const reportedState = machineData?.state?.reported;

  // El array 'bombas' contendrá objetos del tipo ComponentBomba
  const bombas: ComponentBomba[] = reportedState
    ? Object.entries(reportedState)
        .filter(([key, value]) => key.startsWith('Bomba_') && typeof value === 'object' && value !== null)
        .sort(([keyA], [keyB]) => {
          const indexA = parseInt(keyA.split('_')[1] || '0', 10);
          const indexB = parseInt(keyB.split('_')[1] || '0', 10);
          return indexA - indexB;
        })
        .map(([key, value]) => ({ key, ...(value as ShadowBombaFields) })) // Creamos objetos ComponentBomba
    : [];

  useEffect(() => {
    const initialEditData: { [bombaId: string]: ComponentBomba } = {};
    bombas.forEach(bomba => { // 'bomba' aquí es de tipo ComponentBomba
      initialEditData[bomba.key] = { ...bomba }; // Copiamos el objeto ComponentBomba
    });
    setEditedData(initialEditData);
  }, [machineData]); // O [bombas] si 'bombas' es la dependencia directa y estable

  const { downloadExcel } = useDownload(machineData, thingName);

  if (bombas.length === 0) {
    return <div className="text-white p-4">No hay datos de bombas disponibles.</div>;
  }

  const handleEditToggle = () => {
    if (isEditing) {
      const initialEditData: { [bombaId: string]: ComponentBomba } = {};
      bombas.forEach(bomba => {
        initialEditData[bomba.key] = { ...bomba };
      });
      setEditedData(initialEditData);
    }
    setIsEditing(!isEditing);
  };

  const handleSend = () => {
    const changes: ChangesPayload = {};
    const originalReported = machineData?.state?.reported || {}; // Estructura: { "Bomba_1": {TimeCycle:"...", ...} }

    Object.keys(editedData).forEach(bombaKey => { // bombaKey es "Bomba_1", "Bomba_2", etc.
      // originalFields es de tipo ShadowBombaFields (sin 'key' interna)
      const originalFields = originalReported[bombaKey] as ShadowBombaFields | undefined;
      // editedStateBomba es de tipo ComponentBomba (con 'key' interna)
      const editedStateBomba = editedData[bombaKey];

      const bombaSpecificChanges: Partial<ShadowBombaFields> = {};

      if (originalFields && editedStateBomba) {
        // Iteramos sobre las claves de editedStateBomba.
        // 'field' será de tipo 'keyof ComponentBomba', que es (keyof ShadowBombaFields | "key")
        (Object.keys(editedStateBomba) as Array<keyof ComponentBomba>).forEach(field => {
          // ESTA COMPARACIÓN AHORA ES VÁLIDA:
          // 'field' puede ser "key" porque 'keyof ComponentBomba' incluye "key".
          if (field === 'key') {
            return; // No incluimos la propiedad 'key' en el payload de cambios
          }

          // Después del 'if' anterior, TypeScript sabe que 'field' no es "key".
          // Por lo tanto, 'field' aquí es de tipo 'keyof ShadowBombaFields'.
          // Comparamos el valor de editedStateBomba[field] con originalFields[field]
          if (
            editedStateBomba[field] !== undefined && // Asegurarnos de que el campo existe en el objeto editado
            originalFields.hasOwnProperty(field) && // El campo existía en el original
            editedStateBomba[field] !== originalFields[field]
          ) {
            bombaSpecificChanges[field] = editedStateBomba[field];
          } else if (
            !originalFields.hasOwnProperty(field) && // El campo es nuevo (no estaba en el original)
            editedStateBomba[field] !== undefined
          ) {
            bombaSpecificChanges[field] = editedStateBomba[field];
          }
        });
      }

      if (Object.keys(bombaSpecificChanges).length > 0) {
        changes[bombaKey] = bombaSpecificChanges;
      }
    });

    if (Object.keys(changes).length > 0) {
      console.log( changes);
    } else {
      console.log("No se detectaron cambios para enviar.");
    }
    setIsEditing(false);
  };

  // 'field' aquí se refiere a una clave de ShadowBombaFields, que son los datos modificables.
  const handleInputChange = (bombaKey: string, field: keyof ShadowBombaFields, value: string) => {
    setEditedData(prev => {
      const currentBomba = prev[bombaKey]; // Esto es ComponentBomba
      return {
        ...prev,
        [bombaKey]: {
          ...currentBomba, // Mantenemos todas las propiedades de ComponentBomba (incluida 'key')
          [field]: value   // Actualizamos solo el campo de datos específico
        }
      };
    });
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg w-full max-w-3xl font-mono text-sm">
      <table className="w-full border-collapse">
        <thead>
          {/* ... Encabezados de la tabla ... */}
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
          {bombas.map((bomba, index) => { // 'bomba' es de tipo ComponentBomba
            const currentEdit = editedData[bomba.key] || bomba; // 'currentEdit' también es ComponentBomba
            const tiempo = currentEdit.TimeCycle || 'N/A';
            const costoStr = currentEdit.CreditCost || '0';
            const cantidadStr = currentEdit.CountLimit || '0';
            const numVentasStr = currentEdit.CountSale || '0';

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
                      value={tiempo === 'N/A' ? '' : tiempo}
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
                      value={numVentasStr}
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
      {/* ... Botones ... */}
      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={downloadExcel}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 active:bg-blue-800 disabled:opacity-50"
          disabled={isEditing}
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
