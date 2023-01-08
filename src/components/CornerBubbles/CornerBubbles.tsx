import useTokenData from "@/hooks/useTokenData";
const CornerBubbles = () => {
  const data = useTokenData();
  console.log(data);
  return (
    <>
      <div className="fixed w-52 h-52 bg-sky-500 -left-5 -top-24 rounded-full -z-30"></div>
      <div className="fixed w-96 h-96 bg-sky-400 -right-14 -bottom-14 rounded-full -z-30"></div>
      <div className="fixed w-44 h-44 bg-teal-200 left-32 bottom-14 rounded-full -z-30"></div>
      <div className="fixed w-32 h-32 bg-teal-300 right-80 top-14 rounded-full -z-30"></div>
      <div className="fixed w-96 h-96 bg-sky-300 left-80 top-10 rounded-full -z-30"></div>
      <div className="fixed left-28 top-5 -ml-1 text-slate-50 font-medium">
        <p className="flex flex-col text-xl tracking-wide">
          {" "}
          <span className="text-xs">Prihlaseny:</span>
          ID: {data.id_employee}
        </p>
      </div>
    </>
  );
};

export default CornerBubbles;
