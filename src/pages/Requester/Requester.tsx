import {
  Button,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import useTokenData from "@/hooks/useTokenData";
import { DatePicker } from "@mantine/dates";
import axios from "axios";
import { useEffect, useState } from "react";
import { PatientsData, DepartmentsData} from "@/types";
import { useLocation } from "react-router";

function Requester() {
  const route = useLocation();
  const [patients, setPatients] = useState<PatientsData[]>([]);
  const [departments, setDepartments] = useState<DepartmentsData[]>([]);
  const getUsers = () => {
    axios
      .get("http://localhost:3000/requester/getPatients")
      .then((response: any) => {
        //console.log(response);
        setPatients(response.data);
        //console.log(route.search?.slice(1));
        form.values.id_patient = route.search.slice(1);
      });
  };

 const getDepartment = () => {
   axios
     .get("http://localhost:3000/requester/getDepartment")
     .then((response: any) => {
      //console.log(response);
       setDepartments(response.data);
     });
 };

  const sendRequester = () => {
    axios
      .post("http://localhost:3000/requester", {
        description: form.values.description,
        id_employee: form.values.id_employee,
        id_patient: form.values.id_patient,
        department: form.values.department,
      })
      .then(() => {
        window.location.href = "/";
      });
  };
  const datas = useTokenData();
  const form = useForm({
    initialValues: {
      id_employee: datas.id_employee,
      id_patient: "",
      date: new Date(),
      department: [],
      description: "",
    },
    validate: {
      id_patient: (value) => (value.length === 0 ? "Zvoľte pacienta" : null),
      department: (value) => (!value.length ? "Zvoľte oddelenie" : null),
    },
  });
  //console.log(form);
  useEffect(() => getUsers(), []);
  useEffect(() => getDepartment(), []);

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
        Žiadanka na odborné vyšetrenie
        <div className="mt-2 m-auto max-w-xs h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
      </h1>
      <form
        className="flex flex-col w-3/4 m-auto pl-6 pr-6 pt-14 pb-14 bg-white shadow-xl border-2 border-slate-100 opacity-0 translate-y-16 translate duration-300"
        onSubmit={form.onSubmit(form.reset)}
        onReset={form.onReset}
      >
        <div className="flex justify-between mb-8">
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
        <Select
          className="mb-8"
          label="Vyberte oddelenie"
          placeholder="Zvoľte oddelenie"
          data={departments.map((department) => ({
            value: department.NAZOV,
            label: department.NAZOV,
          }))}
          searchable
          limit={100}
          clearable
          maxDropdownHeight={300}
          nothingFound="Prázdny zoznam"
          {...form.getInputProps("department")}
        />

        <Textarea
          className="mb-8"
          label="Popis"
          description="Popis dôvodu žiadania o vyšetrenie"
          radius="md"
          {...form.getInputProps("description")}
        />

        <Button
          onClick={sendRequester}
          className="w-1/4 m-auto text-xl bg-blue-400 hover:-translate-y-1 hover:shadow-md transition-all duration-300 "
          type="submit"
        >
          Odoslať
        </Button>
      </form>
    </div>
  );
}

export default Requester;
