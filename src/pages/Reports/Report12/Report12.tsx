import ReusableTable from "@/components/ReusableTable";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface Report12 {
  ODDELENIA: {
    nazov_oddelenia: string;
    doktori: string[];
  };
}

const Report12 = () => {
  const [employeeData, setEmployeeData] = useState<Report12[]>([]);

  useEffect(() => {
    try {
      axios.get("http://localhost:3000/report-12").then((res) => {
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
        Oddelenia s lôžkovou časťou. Počet:{" "}
        <span className="counter text-cyan-700 text-3xl inline-block opacity-0 -translate-y-16 translate duration-300">
          {" "}
          {numberOfResults + 1}
        </span>
        <div className="mt-2 max-w-md h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
      </h1>
      <ReusableTable
        data={employeeData}
        tableHeaders={["Názov oddelenia", "Zamestnanci"]}
        tableRow={({ ODDELENIA }) => (
          <tr className="hover:bg-blue-100" key={ODDELENIA.nazov_oddelenia}>
            <td>{ODDELENIA.nazov_oddelenia}</td>
            <td>{ODDELENIA.doktori.join(",")}</td>
          </tr>
        )}
      />
    </div>
  );
};
export default Report12;
