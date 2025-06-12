"use client"
import { useState } from 'react';

interface ButtonUpDateProps {
  thingName: string | undefined;
}

const ButtonUpDate = (thingName: ButtonUpDateProps) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const handleUpDate = async () => {
        setIsLoading(true);
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
            setIsLoading(false);
          }        
    }
  

  return (
    <div className="flex justify-center gap-2 max-sm:flex-col">   
      <button
        onClick={handleUpDate}
        disabled={isLoading}
        className={`bg-cyan-600 hover:bg-cyan-700 text-white font-bold h-max w-full py-2 px-4 rounded self-start mb-4 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Actualizando' : 'Actualizar'}
      </button>
    </div>
  );
};

export default ButtonUpDate;
