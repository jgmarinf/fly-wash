"use client"

const ButtonSendMoney = () => {

  return (
    <div className="flex justify-center gap-2 max-sm:flex-col">   
        <input type="text" className="bg-gray-700 text-white h-10 rounded w-full text-center" placeholder="Cantidad" />
        <button
            onClick={() => {}} 
            className="bg-green-600 hover:bg-green-700 text-white font-bold h-max w-full py-2 px-4 rounded self-start mb-4"
        >
        Enviar Saldo
        </button>

    </div>
  )
}

export default ButtonSendMoney
