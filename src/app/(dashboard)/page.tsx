import MachineGrid from "@/components/machine/MachineGrid"

const page = () => {
  return (
    <div className="bg-blue-950 p-5 flex flex-col gap-2 w-full min-h-screen overflow-auto">
      <MachineGrid />
    </div>
  )
}

export default page
