"use client"
import { useState } from 'react';

interface ButtonSendMoneyProps {
  thingName: string | undefined;
}

const ButtonSendMoney = (thingName: ButtonSendMoneyProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSendMoney = async () => {
    if (!inputValue) {
      alert('No hay valor para enviar');
      setInputValue('');
      return;
    }

    if (!/^\d+$/.test(inputValue)) {
      alert('El valor debe ser un número');
      setInputValue('');
      return;
    }

    alert(`Enviando ${inputValue} a la maquina`);

    try {
      await fetch('/api/sendMoney', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputValue, thingName }),
      });
    } catch (error) {
      console.error('Error al enviar saldo:', error);
    } finally {
      setInputValue('');
    }
  };

  return (
    <div className="flex justify-center gap-2 max-sm:flex-col">   
      <input
        type="text"
        className="bg-gray-700 text-white h-10 rounded w-full text-center"
        placeholder="Cantidad"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        onClick={handleSendMoney}
        className="bg-green-600 hover:bg-green-700 text-white font-bold h-max w-full py-2 px-4 rounded self-start mb-4"
      >
        Enviar Saldo
      </button>
    </div>
  );
};

export default ButtonSendMoney;
