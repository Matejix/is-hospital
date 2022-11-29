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

  return backendData === undefined ? (
    <p>Loading...</p>
  ) : (
    <div className="w-full p-10">
      <h1 className="mb-10 text-2xl font-bold">
        Počet osôb pre každú krvnú skupinu podľa pohlavia
        <div className="mt-2 max-w-md h-1 bg-cyan-400"></div>
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
