import MachineGrid from "@/components/machine/MachineGrid"
import ButtonCreateMachine from "@/components/ui/ButtonCreateMachine"

const page = () => {
  return (
    <div className=" bg-blue-950 flex flex-col gap-2 w-full h-screen ">
      <ButtonCreateMachine/>
      <MachineGrid />
    </div>
  )
}

export default page
