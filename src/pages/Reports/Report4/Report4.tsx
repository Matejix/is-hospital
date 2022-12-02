import ReusableChart from "@/components/ReusableChart";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

interface ReportInterface {
  NAZOV: string;
  POCET: number;
}

const Report4 = () => {
  const [backendData, setBackendData] = useState<ReportInterface[]>([]);
  useEffect(() => {
    try {
      axios.get("http://localhost:3000/report-4").then((res) => {
        //console.log(res.data);
        const data = res.data as ReportInterface[];
        setBackendData(data);
      });
    } catch {
      console.log("chyba pri načitani");
    }
  }, []);

  const labelsArray = backendData.map(({ NAZOV }) => {
    return NAZOV;
  });
  const labels = labelsArray; // os-x nazvy

  const labelData = ["Počet poistencov"]; // legenda grafu

  const bgColors = [
    "rgba(88, 0, 255, 0.5)", // fialova
    "rgba(0, 150, 255, 0.5)", // modra
    "rgba(0, 215, 255, 0.5)", // svetlo modra
    "rgba(114, 255, 255, 0.5)", // najsvetlejšia modra
  ];
  const datas = labelData.map((item, i) => {
    let arr = backendData.map(({ POCET }) => {
      return POCET;
    });
    return {
      // VYTVORENIE OBJEKTU
      label: item,
      data: arr,
      backgroundColor: bgColors[2],
    };
  });
  //console.log(datas);

  //NATVRDO NAPÍSANE HODNOTY
  // const datasets = [
  //   {
  //     label: "Počet poistencov",
  //     data: [1550, 1553,],
  //     backgroundColor: "rgba(255, 99, 5, 0.5)",
  //   },
  // ];
  useEffect(() => {
    const h1El = document.querySelector("h1");
    setTimeout(() => {
      h1El?.classList.replace("opacity-0", "opacity-100");
      h1El?.classList.replace("-translate-y-16", "-translate-y-0");
    }, 500);
  }, []);
  return (
    <div className="w-full h-screen p-10">
      <h1 className="mb-10 text-2xl font-bold opacity-0 -translate-y-16 translate duration-300">
        Počet aktuálne poistených pacientov pre poisťovňu.
        <div className="mt-2 max-w-md h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
      </h1>
      <ReusableChart labels={labels} datasets={datas} />;
    </div>
  );
};

export default Report4;
