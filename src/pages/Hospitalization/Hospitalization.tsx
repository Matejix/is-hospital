import {
  Button,
  MultiSelect,
  Select,
  Textarea,
  TextInput,
  Tabs
} from "@mantine/core";
import { useForm } from "@mantine/form";
import useTokenData from "@/hooks/useTokenData";
import { DatePicker } from "@mantine/dates";
import axios from "axios";
import { useEffect, useState } from "react";
import { DepartmentsData, PatientsData, Report_typeData, AlergiesData,  DiagnosesData, CheckupsData, PerformancesData} from "@/types";
import React from "react";



function Hospitalization() {
  const [patients, setPatients] = useState<PatientsData[]>([]);
  const [departments, setDepartments] = useState<DepartmentsData[]>([]);
  const [reportTypes, setReportTypes] = useState<Report_typeData[]>([]);
  const [alergies, setAlergies] = useState<AlergiesData[]>([]);
  const [diagnoses, setDiagnoses] = useState<DiagnosesData[]>([]);
  const [checkups, setCheckups] = useState<CheckupsData[]>([]);
  //const [performances, setPerformances] = useState<PerformancesData[]>([]);


  const [status, setStatus] = React.useState(0);
  const radioHandler = (status : any) => {
    setStatus(status);
  };
  


  const getUsers = () => {
    axios
      .get("http://localhost:3000/hospitalization/getPatients")
      .then((response: any) => {
        //console.log(response);
        setPatients(response.data);
      });
  };

  const getDeps = () => {
    axios
      .get("http://localhost:3000/hospitalization/getDepartments")
      .then((response: any) => {
        //console.log(response);
        setDepartments(response.data);
      });
  };

  const getReps = () => {
    axios
      .get("http://localhost:3000/hospitalization/getReportTypes")
      .then((response: any) => {
        //console.log(response);
        setReportTypes(response.data);
      });
  };


  const getAlrgs = () => {
    axios
      .get("http://localhost:3000/hospitalization/getAlergies")
      .then((response: any) => {
        //console.log(response);
        setAlergies(response.data);
      });
  };

  const getDiags = () => {
    axios
      .get("http://localhost:3000/hospitalization/getDiagnoses")
      .then((response: any) => {
        //console.log(response);
        setDiagnoses(response.data);
      });
  };

  const getChecks = () => {
    axios
      .get("http://localhost:3000/hospitalization/getCheckups")
      .then((response: any) => {
        //console.log(response);
        setCheckups(response.data);
      });
  };






  /*const sendHospitalization = () => {
    axios
      .post("http://localhost:3000/hospitalization", {
        description: form.values.description,
        id_employee: form.values.id_employee,
        id_patient: form.values.id_patient,
        department: form.values.department,
      })
      .then(() => {
        window.location.href = "/";
      });
  };*/

  const datas = useTokenData();
  const form = useForm({
    initialValues: {
      id_employee: datas.id_employee,
      id_patient: "",
      date: new Date(),
      reportType: [],
      alergies: [],
      diagnoses: [],
      checkups: [],
      description: "",
    },
    validate: {
      id_patient: (value) => (value.length === 0 ? "Zvoľte pacienta" : null),
      reportType: (value) => (!value.length ? "Zvoľte typ" : null),
    },
  });

  useEffect(() => getUsers(), []);
  useEffect(() => getReps(), []);
  useEffect(() => getAlrgs(), []);
  useEffect(() => getChecks(), []);
  useEffect(() => getDiags(), []);

  useEffect(() => {
    const h1El = document.querySelector("h1");
    const formEl = document.querySelector("form");
    setTimeout(() => {
      h1El?.classList.replace("opacity-0", "opacity-100");
      h1El?.classList.replace("-translate-y-16", "-translate-y-0");
      formEl?.classList.replace("opacity-0", "opacity-100");
      formEl?.classList.replace("translate-y-16", "translate-y-0");
    }, 500);
  }, []);


  return (

    

    <div className="mt-10 m-auto w-2/3">
      <h1 className="mb-10 text-4xl font-bold text-center tracking-widest opacity-0 -translate-y-16 translate duration-300">
        Záznam
        <div className="mt-2 m-auto max-w-xs h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
      </h1>

      <div>
        
            <div className="RecordsPanel">


            <form
                className="flex flex-col m-auto pl-6 pr-6 pt-14 pb-14 bg-white shadow-xl border-2 border-slate-100 opacity-0 translate-y-16 translate duration-300"
                onSubmit={form.onSubmit(form.reset)}
                onReset={form.onReset}
              >


      <fieldset className="pt-0 m-auto">
        <p className="pb-8">
          <input
             type="radio" name="release" checked={status === 1} onClick={(e) => radioHandler(1)} 
          />
          <label htmlFor="Sprava" className="pr-6 pl-1 font-bold">Správa</label>
        

        
          <input
            type="radio" name="release" checked={status === 2} onClick={(e) => radioHandler(2)}
          />
          <label htmlFor="Diagnoza" className="pr-6 pl-1 font-bold">Diagnóza</label>


          <input
             type="radio" name="release" checked={status === 3} onClick={(e) => radioHandler(3)} 
          />
          <label htmlFor="vysetrenie" className="pr-6 pl-1 font-bold">Vyšetrenie</label>



          <input
             type="radio" name="release" checked={status === 4} onClick={(e) => radioHandler(4)} 
          />
          <label htmlFor="alergia" className="pr-6 pl-1 font-bold">Alergia</label>
        

        </p>
      </fieldset>

                <div className="flex justify-between mb-9">
                  <TextInput
                    className="basis-1/6"
                    withAsterisk
                    label="ID doktora"
                    {...form.getInputProps("id_employee")}
                  />
                  <DatePicker
                    className="basis-1/4"
                    withAsterisk
                    label="Dátum"
                    {...form.getInputProps("date")}
                  />

                  <Select
                    className="basis-1/2"
                    withAsterisk
                    label="Vyberte pacienta"
                    placeholder="Zvoľte jedného pacienta"
                    data={patients.map((patient) => ({
                      value: patient.ROD_CISLO,
                      label:
                        patient.ROD_CISLO +
                        " " +
                        patient.MENO +
                        " " +
                        patient.PRIEZVISKO,
                    }))}
                    searchable
                    maxDropdownHeight={400}
                    nothingFound="Prázdny zoznam"
                    {...form.getInputProps("id_patient")}
                  />

                


                </div>

                {status === 1 && <MultiSelect
                  className="mb-8"
                  label="Vyberte typ správy"
                  placeholder="Zvoľte typ správy"
                  data={reportTypes.map((reportType) => ({
                    value: reportType.TYP_SPRAVY,
                    label: reportType.TYP_SPRAVY,
                  }))}
                  searchable
                  limit={100}
                  clearable
                  maxDropdownHeight={300}
                  nothingFound="Prázdny zoznam"
                  {...form.getInputProps("reportType")}
                />}

                {status === 2 && <MultiSelect
                  className="mb-8"
                  label="Vyberte diagnózu"
                  placeholder="Zvoľte diagnózu"
                  data={diagnoses.map((diagnose) => ({
                    value: diagnose.NAZOV,
                    label: diagnose.NAZOV,
                  }))}
                  searchable
                  limit={100}
                  clearable
                  maxDropdownHeight={300}
                  nothingFound="Prázdny zoznam"
                  {...form.getInputProps("diagnose")}
                />}

                  {status === 3 && <MultiSelect
                  className="mb-8"
                  label="Vyberte vyšetrenie"
                  placeholder="Zvoľte vyšetrenie"
                  data={checkups.map((checkup) => ({
                    value: checkup.NAZOV_VYSETRENIA,
                    label: checkup.NAZOV_VYSETRENIA,
                  }))}
                  searchable
                  limit={100}
                  clearable
                  maxDropdownHeight={300}
                  nothingFound="Prázdny zoznam"
                  {...form.getInputProps("checkup")}
                />}

                  {status === 4 && <MultiSelect
                  className="mb-8 "
                  label="Vyberte typ alergie"
                  placeholder="Zvoľte typ alergie"
                  data={alergies.map((alergy) => ({
                    value: alergy.NAZOV_ALERGIE,
                    label: alergy.NAZOV_ALERGIE,
                  }))}
                  searchable
                  limit={100}
                  clearable
                  maxDropdownHeight={300}
                  nothingFound="Prázdny zoznam"
                  {...form.getInputProps("alergy")}
                />}

                

                <Textarea
                  className="mb-16"
                  label="Popis"
                  placeholder="Popis oddelenia"
                  radius="md"
                  {...form.getInputProps("description")}
                />
                <Button
                  /*onClick={sendRecipe}*/
                  className="w-1/5 m-auto text-xl bg-blue-400 hover:-translate-y-1 hover:shadow-md transition-all duration-300 "
                  type="submit"
                >
                  Odoslať
                </Button>
              </form>

              
            </div>
        </div>
    </div>
  );
}


export default Hospitalization;
