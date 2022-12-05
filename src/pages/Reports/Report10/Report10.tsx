import EmployeeCard from "@/components/EmployeeCard";
import { createStyles, Avatar, Text, Group } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";

interface Report10 {
  FOTOGRAFIA: Buffer;
  CELE_MENO: string;
  TITUL: string;
  TEL: string;
  EMAIL: string;
  NAZOV: string;
}

function Report10() {
  const [employeeData, setEmployeeData] = useState<Report10[]>([]);
  useEffect(() => {
    try {
      axios.get("http://localhost:3000/report-10").then((res) => {
        console.log(res.data);
        const data = res.data as Report10[];
        setEmployeeData(data);
      });
    } catch {
      console.log("chyba pri načitani");
    }
  }, []);

  useEffect(() => {
    const h1El = document.querySelector("h1");
    const cardEl = document.getElementById("cards");
    setTimeout(() => {
      h1El?.classList.replace("opacity-0", "opacity-100");
      h1El?.classList.replace("-translate-y-16", "-translate-y-0");
      cardEl?.classList.replace("opacity-0", "opacity-100");
      cardEl?.classList.replace("translate-y-16", "-translate-y-0");
    }, 700);
  }, []);

  return (
    <div className="w-full p-10">
      <h1 className="mb-10 text-2xl font-bold opacity-0 -translate-y-16 translate duration-300">
        Najdlhšie pracujúci zamestnanci.
        <div className="mt-2 max-w-md h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
      </h1>
      <div
        id="cards"
        className="grid grid-cols-2 gap-10 opacity-0 translate-y-16 translate duration-300"
      >
        {employeeData.map(
          ({ FOTOGRAFIA, CELE_MENO, TITUL, TEL, EMAIL, NAZOV }) => {
            return (
              <EmployeeCard
                avatar={FOTOGRAFIA}
                name={CELE_MENO}
                title={TITUL}
                phone={TEL}
                email={EMAIL}
                occupation={NAZOV}
              />
            );
          }
        )}
      </div>
    </div>
  );
}

export default Report10;
