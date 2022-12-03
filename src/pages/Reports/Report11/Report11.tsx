import ReusableTable from "@/components/ReusableTable";
import axios from "axios";
import { createStyles, SegmentedControl } from '@mantine/core';
import React, { useEffect, useState } from "react";
const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    boxShadow: theme.shadows.md,
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1]
    }`,
  },

  active: {
    backgroundColor: theme.colors.blue,
  },

  control: {
    border: '0 !important',
  },

  labelActive: {
    color: `${theme.white} !important`,
  },
}));


interface Report11 {
  ODDELENIA: {
    nazov_oddelenia: string;
    doktori: string[];
  };
}

const Report11 = () => {
  const { classes } = useStyles();
  const [employeeData, setEmployeeData] = useState<Report11[]>([]);
  const [value, setValue] = useState('N');

  useEffect(() => {
    try {
      axios.get("http://localhost:3000/report-11").then((res) => {
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
  /*const changeOutput =() => {
    console.log(value);
    try {
      axios.post("http://localhost:3000/report-11", {
        value: value,
      }).then((res) => {
        console.log(res.data);
        setEmployeeData(res.data);
      });
    } catch {
      console.log("chyba pri načitani");
    }
  };*/
  useEffect(() => {
    console.log(value);
    try {
      axios.post("http://localhost:3000/report-11", {
        value: value,
      }).then((res) => {
        console.log(res.data);
        setEmployeeData(res.data);
      });
    } catch {
      console.log("chyba pri načitani");
    }
  }, [value])


  return (
    <div className="w-full p-10">
      
      <h1 className="mb-2 text-2xl font-bold opacity-0 -translate-y-16 translate duration-300">
        Oddelenia, ktoré nemajú alebo majú lôžkovú časť. Počet:{" "}
      
        <span className="counter text-cyan-700 text-3xl inline-block opacity-0 -translate-y-16 translate duration-300">
          {" "}
          {numberOfResults + 1}
        </span>
        <div className="mt-2 max-w-md h-1 bg-gradient-to-r from-cyan-400 to-blue-500">
          
        </div>
     
      </h1>
      <div className="content-center w-full flex justify-center">
        <SegmentedControl
          value={value}
          onChange={setValue}
          radius="xl"
          size="md"
          data={[
            { label: 'Bez lôžkovej časti', value: 'N' },
            { label: 'S lôžkovou časťou', value: 'A' },
          ]}
          classNames={classes}
          className="m-5"
        />
      </div>
      <ReusableTable
        data={employeeData}
        tableHeaders={["Názov oddelenia", "Zamestnanci"]}
        tableRow={({ ODDELENIA }) => (
          <tr className="hover:bg-blue-100" key={ODDELENIA.nazov_oddelenia}>
            <td>{ODDELENIA.nazov_oddelenia}</td>
            <td>{ODDELENIA.doktori.join(", ")}</td>
          </tr>
        )}
      />
    </div>
  );
};

export default Report11;
