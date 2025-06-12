"use client"

interface ButtonUpDateProps {
  thingName: string | undefined;
}

const ButtonUpDate = (thingName: ButtonUpDateProps) => {
    
    const handleUpDate = async () => {
        console.log(thingName)
        try {
            await fetch('/api/upDateState', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ thingName }),
            });
          } catch (error) {
            console.error('Error al enviar saldo:', error);
          } finally {
            
          }        
    }
  

  return (
    <div className="flex justify-center gap-2 max-sm:flex-col">   
      <button
        onClick={handleUpDate}
        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold h-max w-full py-2 px-4 rounded self-start mb-4"
      >
        Actualizar
      </button>
    </div>
  );
};

export default ButtonUpDate;
