import dataModel from "../../assets/dataModel.png";

const DataModel = () => {
  return (
    <div className="group grid h-screen place-items-center ">
      <div className="w-4/5">
        <img
          className="border-2 border-blue-100 drop-shadow-md -translate-x-7 transition duration-700 group-hover:scale-105"
          src={dataModel}
          alt="Obrázok databázového modelu"
        />
        <div className="w-4/5 h-4/5 bg-blue-400 absolute top-6 -z-10 transition duration-700 group-hover:-translate-y-2 group-hover:blur-sm"></div>
      </div>
    </div>
  );
};

export default DataModel;
