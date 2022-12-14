import ReusableTable from "@/components/ReusableTable";
import axios from "axios";
import React, { useEffect, useState } from "react";
interface Report6 {
  PACIENTI: {
    pacient: string;
    zaznamy: string[];
  };
}

type Zaznam = {
  TYP: string;
  DATUM: string;
};


const Report6 = () => {
  const [employeeData, setEmployeeData] = useState<Report6[]>([]);

  useEffect(() => {
    try {
      axios.get("http://localhost:3000/report-6").then((res) => {
        console.log(res.data);
        setEmployeeData(res.data);
      });
    } catch {
      console.log("chyba pri načitani");
    }
  }, []);

  let numberOfResults = 0; // počet riadkov
  Object.keys(employeeData).map((item, i) => {
    numberOfResults = i;
  });

  useEffect(() => {
    const h1El = document.querySelector("h1");
    const counterEl = document.querySelector(".counter");
    setTimeout(() => {
      h1El?.classList.replace("opacity-0", "opacity-100");
      h1El?.classList.replace("-translate-y-16", "-translate-y-0");
    }, 500);

    setTimeout(() => {
      counterEl?.classList.replace("-translate-y-16", "-translate-y-0");
      counterEl?.classList.replace("opacity-0", "opacity-100");
    }, 1000);
  }, []);

  return (
    <div className="w-full p-10">
      <h1 className="mb-10 text-2xl font-bold opacity-0 -translate-y-16 translate duration-300">
        Pacienti s najvyšším počtom záznamov v zdravotnej karte

        <div className="mt-2 max-w-md h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
      </h1>
      <ReusableTable
        data={employeeData}
        tableHeaders={["Pacient", "Záznamy"]}
        tableRow={({ PACIENTI }) => (
          <tr className="hover:bg-blue-100" key={PACIENTI.pacient}>
            <td className="font-bold">{PACIENTI.pacient}</td>
            <td>{PACIENTI.zaznamy.map(s=><React.Fragment>{s}<br/></React.Fragment>)}</td>
          </tr>
        )}
      />
    </div>
  );
};

export default Report6;
