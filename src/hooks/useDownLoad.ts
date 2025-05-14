// src/hooks/useDownLoad.ts

import type { BombaData, MachineProps } from '@/interfaces/Machine';
import * as XLSX from 'xlsx';

// Helper function to safely parse string to number (moved from MachineTab)
const safeParseInt = (value: string | undefined, defaultValue = 0): number => {
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const useDownload = (machineData: MachineProps | undefined, thingName: string | undefined) => {

  const downloadExcel = () => {
    if (!machineData) {
      alert("Datos de la máquina no disponibles.");
      return;
    }

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
      alert("No hay datos de bombas para descargar.");
      return;
    }

    // Prepare data for Excel sheet
    const dataForSheet = [
      ["BOMBA NAME", "TIEMPO", "COSTO ($", "CANTIDAD PRODUCTO", "# VENTAS", "RECORD COUNT", "COUNT WARNING", "VENTAS ($"], // Header row
      ...bombas.map((bomba, index) => {
        const tiempo = bomba.TimeCycle || 'N/A';
        const costo = safeParseInt(bomba.CreditCost);
        const cantidad = safeParseInt(bomba.CountLimit);
        const numVentas = safeParseInt(bomba.CountSale);
        const recordCount = safeParseInt(bomba.RecordCount);
        const countWarning = safeParseInt(bomba.CountWarning);
        const ventasTotal = numVentas * costo;
        return [
          `Bomba ${index + 1}`,
          tiempo,
          costo, // Keep as number for potential calculations in Excel
          cantidad,
          numVentas,
          recordCount,
          countWarning,
          ventasTotal // Keep as number
        ];
      })
    ];

    // Create worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet(dataForSheet);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estado Maquina");

    // Format date for filename
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const fileName = `machine_state_${thingName || 'unknown'}_${dateString}.xlsx`; // Use passed thingName
    // Trigger download
    XLSX.writeFile(wb, fileName);
  };

  return { downloadExcel }; // Return the function to be called
};
