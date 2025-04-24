




const Machine = ({ thingName }: { thingName?: string }) => {
  // Destructure thingName for easier access

  return (
    <div className={`bg-gray-800 text-white p-4 rounded-lg shadow-md`}>
      <h3 className="text-lg font-semibold mb-2">{thingName ? thingName : "Machine"}</h3>
      {/* Placeholder for more machine details */}
      <p className="text-sm text-gray-400">Details will go here...</p>
      {/* You can access other thing properties like thing.thingArn, etc. */}
    </div>
  );
};

export default Machine;
