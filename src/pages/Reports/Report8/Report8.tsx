import ReusableTable from "@/components/ReusableTable";
import axios from "axios";
import react, { useState, useEffect } from "react";

interface ReportInterface {
  NAZOV_KRAJA: string;
  POCET_NARODENYCH: string;
  POCET_ZOSNULYCH: number;
}

const Report8 = () => {
  const [backendData, setBackendData] = useState<ReportInterface[]>([]);
  useEffect(() => {
    try {
      axios.get("http://localhost:3000/report-8").then((res) => {
        //console.log(res.data);
        const data = res.data as ReportInterface[];
        setBackendData(data);
      });
    } catch {
      console.log("chyba pri načitani");
    }
  }, []);

  useEffect(() => {
    const h1El = document.querySelector("h1");
    setTimeout(() => {
      h1El?.classList.replace("opacity-0", "opacity-100");
      h1El?.classList.replace("-translate-y-16", "-translate-y-0");
    }, 500);
  }, []);

  return backendData === undefined ? (
    <p>Loading...</p>
  ) : (
    <div className="w-full p-10">
      <h1 className="mb-10 text-2xl font-bold opacity-0 -translate-y-16 translate duration-300">
        Počty narodených a zosnulých pacientov pre jednotlivé kraje za posledných 10 rokov
        <div className="mt-2 max-w-md h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
      </h1>
      <ReusableTable
        data={backendData}
        tableHeaders={["Kraj", "Počet narodených", "Počet zosnulých"]}
        tableRow={({ NAZOV_KRAJA, POCET_NARODENYCH, POCET_ZOSNULYCH }) => (
          <tr>
            <td>{NAZOV_KRAJA}</td>
            <td>{POCET_NARODENYCH}</td>
            <td>{POCET_ZOSNULYCH }</td>
          </tr>
        )}
      />
    </div>
  );
};

export default Report8;
