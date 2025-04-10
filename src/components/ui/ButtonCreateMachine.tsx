
const ButtonCreateMachine = () => {
  return (
    <button className="fixed bottom-8 right-8 z-50 p-4 bg-blue-600 rounded-full shadow-2xl hover:bg-blue-700 transition-colors duration-200 hover:scale-110 active:scale-95">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  )
}

export default ButtonCreateMachine
