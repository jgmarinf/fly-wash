import Machine from "@/components/machine/Machine";


const page = () => {
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
    <div className="flex gap-2 w-full h-screen ">
      <Machine data={sampleData} />
    </div>
  )
}

export default page
