import ReusableChart from "@/components/ReusableChart";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

interface ReportInterface {
  KS: string;
  POCET: number;
  POHLAVIE: string;
  RANK: number;
}

const Report7 = () => {
  const [backendData, setBackendData] = useState<ReportInterface[]>([]);
  useEffect(() => {
    try {
      axios.get("http://localhost:3000/report-7").then((res) => {
        //console.log(res.data);
        const data = res.data as ReportInterface[];
        setBackendData(data);
      });
    } catch {
      console.log("chyba pri načitani");
    }
  }, []);

  const labelsArray = backendData.map(({ POHLAVIE }) => {
    return POHLAVIE === "z" ? "Ženy" : "Muži";
  });
  const filteredLabelsArray = [...new Set(labelsArray)];
  console.log(filteredLabelsArray);
  const labels = filteredLabelsArray;
  // SKLADANIE DÁT TAK ABY TO SEDELE S TYPOM DATASETS[]
  // V KOMPONENTE REUSABLECHART (GENEROVANE)

  const labelData = backendData.map(({ KS }) => KS);
  const filteredLabel = [...new Set(labelData)]; // ZBAVENIE SA DUPLICIT
  console.log(labelData);
  console.log(filteredLabel); //nazvy pocty - skupiny

  const bgColors = [
    "rgba(88, 0, 255, 0.5)", // fialova
    "rgba(0, 150, 255, 0.5)", // modra
    "rgba(0, 215, 255, 0.5)", // svetlo modra
    "rgba(114, 255, 255, 0.5)", // najsvetlejšia modra
  ];
  const datas = filteredLabel.map((item, i) => {
    let arr = backendData.map(({ KS, POCET }) => {
      if (KS === item) return POCET; // VYTVORÍ POLE HODNOT PRE DANY LABEL
    });
    let arr2 = arr.filter((item) => {
      return item !== undefined; // VYMAZE UNDEFINED HODNOTY Z POLA
    }) as number[];
    console.log(arr2);

    return {

      // VYTVORENIE OBJEKTU
      label: item,
      data: arr2,
      backgroundColor: bgColors[i],
    };
  });
  console.log(datas);

  // NATVRDO NAPÍSANE HODNOTY
  // const datasets = [
  //   {
  //     label: "A",
  //     data: [1550, 1553],
  //     backgroundColor: "rgba(255, 99, 5, 0.5)",
  //   },
  //   {
  //     label: "B",
  //     data: [610, 612],
  //     backgroundColor: "rgba(255, 99, 46, 0.5)",
  //   },
  //   {
  //     label: "AB",
  //     data: [284, 331],
  //     backgroundColor: "rgba(255, 99, 78, 0.5)",
  //   },
  //   {
  //     label: "0",
  //     data: [1143, 1120],
  //     backgroundColor: "rgba(255, 99, 132, 0.5)",
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
        Počet osôb pre každú krvnú skupinu podľa pohlavia mladších ako 60 rokov
        <div className="mt-2 max-w-md h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
      </h1>
      <ReusableChart labels={labels} datasets={datas} />;
    </div>
  );
};

export default Report7;
