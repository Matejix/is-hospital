import ReusableTable from "@/components/ReusableTable";
import axios from "axios";
import react, { useState, useEffect } from "react";

interface Report9 {
  CELE_MENO: string;
  POCET_HODIN: number;
  PORADIE: number;
}

const Report9 = () => {
  const [employData, setEmployData] = useState<Report9[]>([]);
  useEffect(() => {
    try {
      axios.get("http://localhost:3000/report-9").then((res) => {
        console.log(res.data);
        const data = res.data as Report9[];
        setEmployData(data);
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

  return employData === undefined ? (
    <p>Loading...</p>
  ) : (
    <div className="w-full p-10">
      <h1 className="mb-10 text-2xl font-bold opacity-0 -translate-y-16 translate duration-300">
        Poradie 10-tich zamestnancov, ktorí odpracovali najviac hodín
        <div className="mt-2 max-w-md h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
      </h1>
      <ReusableTable
        data={employData}
        tableHeaders={["Celé meno", "Počet odpracovaných hodín"]}
        tableRow={({ CELE_MENO, POCET_HODIN, PORADIE }) => (
          <tr key={PORADIE + CELE_MENO}>
            <td>{CELE_MENO}</td>
            <td>{POCET_HODIN}</td>
          </tr>
        )}
      />
    </div>
  );
};

export default Report9;
