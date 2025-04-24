// Define the structure for individual Bomba objects
interface BombaData {
  TimeCycle?: string;
  isEnable?: string;
  CountSale?: string;
  CountWarning?: string;
  CountLimit?: string;
  RecordCount?: string;
  CreditCost?: string;
}

// Define the main interface based on the provided JSON structure
export interface MachineProps {
  state: {
    desired?: {
      welcome?: string;
      // Add other desired state properties if needed
    };
    reported: {
      welcome?: string;
      // Use an index signature to allow for variable Bomba_X properties
      [key: string]: BombaData | string | undefined; // Allow BombaData, the welcome string, or undefined
    };
  };
  // Include other props if Machine component needs them, like className
  className?: string;
}
