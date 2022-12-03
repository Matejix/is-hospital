import ReusableTable from "@/components/ReusableTable";
import ReusableChart from "@/components/ReusableChart";

import axios from "axios";
import react, { useState, useEffect } from "react";
type Datasets = {
  label: string;
  data: number[];
  backgroundColor: string;
};
interface ReportInterface {
  POCET_VYSETRENI: number;
  POCET_VYKONOV: number;
  POCET_MEDIKACII: number;
  KVARTAL: number;
}

const Report1 = () => {
  const [backendData, setBackendData] = useState<ReportInterface[]>([]);
  useEffect(() => {
    try {
      axios.get("http://localhost:3000/report-1").then((res) => {
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

  var labelsArray = backendData.map(({ KVARTAL }) => {
    return KVARTAL.toString();
  });
  const labels = labelsArray; // os-x nazvy


  const bgColors = [
    "rgba(88, 0, 255, 0.5)", // fialova
    "rgba(0, 150, 255, 0.5)", // modra
    "rgba(0, 215, 255, 0.5)", // svetlo modra
    "rgba(114, 255, 255, 0.5)", // najsvetlejšia modra
  ];
  let arrMedikacie = backendData.map(({ POCET_MEDIKACII }) => {
    return POCET_MEDIKACII;
  });
  let arrVykony =  backendData.map(({ POCET_VYKONOV }) => {
    return POCET_VYKONOV;
  });
  let arrVysetrenia =  backendData.map(({ POCET_VYSETRENI }) => {
    return POCET_VYSETRENI;
  });
  const label = ["Počet výkonov", "Počet vyšetrení", "Počet medikácií"];
  const datasets = [
    {
      label: label[0],
      data: arrVykony,
      backgroundColor: bgColors[0],
    },
    {
      label: label[1],
      data: arrVysetrenia,
      backgroundColor: bgColors[1],
    },
    {
      label: label[2],
      data: arrMedikacie,
      backgroundColor: bgColors[2],
    }
  ];

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
        Počty výkonov, vyšetrení a medikácií v jednotlivých kvartáloch tohto roka
        <div className="mt-2 max-w-md h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
      </h1>
      <ReusableTable
        data={backendData}
        tableHeaders={["Kvartál roka","Počet výkonov", "Počet vyšetrení", "Počet medikácií"]}
        tableRow={({KVARTAL, POCET_VYKONOV, POCET_VYSETRENI, POCET_MEDIKACII }) => (
          <tr>
            <td>{KVARTAL}</td>

            <td>{POCET_VYKONOV}</td>
            <td>{POCET_VYSETRENI}</td>
            <td>{POCET_MEDIKACII}</td>
          </tr>
        )}
      />
      <ReusableChart labels={labels} datasets={datasets} />
    </div>
  );
};

export default Report1;
