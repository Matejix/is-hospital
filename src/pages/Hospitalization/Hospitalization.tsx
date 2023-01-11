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
import { DepartmentsData, PatientsData, Report_typeData, AlergiesData } from "@/types";




function Hospitalization() {
  const [patients, setPatients] = useState<PatientsData[]>([]);
  const [departments, setDepartments] = useState<DepartmentsData[]>([]);
  const [reportTypes, setReportTypes] = useState<Report_typeData[]>([]);
  const [alergies, setAlergies] = useState<AlergiesData[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<String>();


  const radioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRecord(event.target.value);
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
        <p>
          <input
            type="radio"
            name="drink"
            value="Coffee"
            id="coffee"
            onChange={radioHandler}
          />
          <label htmlFor="coffee" className="pr-4 pl-1">Coffee</label>
        

        
          <input
            type="radio"
            name="drink"
            value="Tea"
            id="tea"
            onChange={radioHandler}
          />
          <label htmlFor="tea" className="pr-4 pl-1">Green Tea</label>
        

        
          <input
            type="radio"
            name="drink"
            value="Pumpkin Juice"
            id="pumpkin"
            onChange={radioHandler}
          />
          <label htmlFor="pumpkin" className="pr-4 pl-1">Pumpkin Juice</label>
        </p>
      </fieldset>

      {/* Display the selected drink */}
      {selectedRecord && <h2>{selectedRecord}</h2>}



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
                <MultiSelect
                  className="mb-8 pt-4"
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
                />

                <Textarea
                  className="mb-16 pt-4"
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
