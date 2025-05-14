// Define the structure for individual Bomba objects
export interface BombaData {
  TimeCycle?: string;
  IsEnable?: string;
  CountSale?: string;
  CountWarning?: string;
  CountLimit?: string;
  RecordCount?: string;
  CreditCost?: string;
}

export interface General {
  Estado: string;
  Saldo: string;
}

// Define the main interface based on the provided JSON structure
export interface MachineProps {
  state: {
    desired?: {
      welcome?: string;
      // Add other desired state properties if needed
    };
    reported: {
      General?: General;
      welcome?: string;
      // Use an index signature to allow for variable Bomba_X properties
      [key: string]: BombaData | string | undefined | General; // Allow BombaData, the welcome string, or undefined
    };
  };
  // Include other props if Machine component needs them, like className
  className?: string;
  thingName?: string;
}
