import ReusableTable from "@/components/ReusableTable";
import axios from "axios";
import react, { useState, useEffect } from "react";

interface ReportInterface {
  KS: string;
  POCET: number;
  POHLAVIE: string;
  RANK: number;
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
        Počet osôb pre každú krvnú skupinu podľa pohlavia mladších ako 60 rokov
        <div className="mt-2 max-w-md h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
      </h1>
      <ReusableTable
        data={backendData}
        tableHeaders={["Krvna skupina", "Počet osôb", "Pohlavie"]}
        tableRow={({ KS, POCET, POHLAVIE, RANK }) => (
          <tr
            key={RANK + POCET}
            className={`transition duration-300 bg-gradient-to-l ${
              POHLAVIE === "z" ? "hover:bg-pink-100" : "hover:bg-blue-100"
            }`}
          >
            <td>{KS}</td>
            <td>{POCET}</td>
            <td>{POHLAVIE === "m" ? "Muž" : "Žena"}</td>
          </tr>
        )}
      />
    </div>
  );
};

export default Report8;
