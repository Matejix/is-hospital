import ReusableTable from "@/components/ReusableTable";
import axios from "axios";
import react, { useState, useEffect } from "react";

interface ReportInterface {
  MENO: string;
  PRIEZVISKO: string;
  TYP_ZDRAVOTNIKA: string;
  ODDELENIE: string;
  POCET: number;
}

const Report3 = () => {
  const [backendData, setBackendData] = useState<ReportInterface[]>([]);
  useEffect(() => {
    try {
      axios.get("http://localhost:3000/report-3").then((res) => {
        console.log(res.data);
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
        15 zdravotníkov, ktorí na svojom oddelení odpracovali počas víkendov najviac hodín
        <div className="mt-2 max-w-md h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
      </h1>
      <ReusableTable
        data={backendData}
        tableHeaders={["Meno", "Priezvisko", "Typ zdravotníka", "Oddelenie","Počet odpracovaných hodín počas víkendov"]}
        tableRow={({ MENO, PRIEZVISKO, TYP_ZDRAVOTNIKA, ODDELENIE, POCET }) => (
          <tr>
            <td>{MENO}</td>
            <td>{PRIEZVISKO}</td>
            <td>{TYP_ZDRAVOTNIKA}</td>
            <td>{ODDELENIE}</td>
            <td>{POCET}</td>
          </tr>
        )}
      />
    </div>
  );
};

export default Report3;
