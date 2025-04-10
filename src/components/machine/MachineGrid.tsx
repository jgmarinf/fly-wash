import Machine from "./Machine";

const MachineGrid = () => {
  const sampleData = {
    TimeCycle: '10',
    isEnable: '1',
    CountSale: '0',
    CountWarning: '5',
    CountLimit: '20',
    RecordCount: '0',
    CreditCost: '1'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-blue-950 min-h-screen">
      {[1, 2, 3].map((machine) => (
        <Machine 
          key={machine} 
          data={sampleData} 
          className="transform hover:scale-105 transition-transform duration-200"
        />
      ))}
    </div>
  )
}

export default MachineGrid
