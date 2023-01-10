import {
  Button,
  MultiSelect,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import useTokenData from "@/hooks/useTokenData";
import { DatePicker } from "@mantine/dates";
import axios from "axios";
import { useEffect, useState } from "react";
import { DepartmentsData, PatientsData } from "@/types";



function Hospitalization() {
  const [patients, setPatients] = useState<PatientsData[]>([]);
  const [departments, setDepartments] = useState<DepartmentsData[]>([]);

  const getUsers = () => {
    axios
      .get("http://localhost:3000/hospitalization/getPatients")
      .then((response: any) => {
        console.log(response);
        setPatients(response.data);
      });
  };

  const getDeps = () => {
    axios
      .get("http://localhost:3000/hospitalization/getDepartments")
      .then((response: any) => {
        console.log(response);
        setDepartments(response.data);
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

 // const datas = useTokenData();
  const form = useForm({
    initialValues: {
      id_employee: "",//datas.id_employee,
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
  useEffect(() => getUsers(), []);
  useEffect(() => getDeps(), []);


  return(
    /*<div>
      <div>
        <form
          className="w-6/12"
          onSubmit={form.onSubmit((values) => console.log(values))}
          onReset={form.onReset}
        >
          <TextInput
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

            <Select
            label="Vyberte oddelenie"
            placeholder="Zvoľte jedno oddelenie"
            data={departments.map((department) => ({
              value: department.NAZOV,
              label:
              department.NAZOV,
            }))}
            searchable
            maxDropdownHeight={400}
            nothingFound="Prázdny zoznam"
            {...form.getInputProps("id_patient")}
          />
          
          <Textarea
            label="Popis"
            description="Popis oddelenia"
            radius="md"
            {...form.getInputProps("description")}
          />

          <Button onClick={sendHospitalization} className="bg-blue-400" type="submit">
            Odoslať
          </Button>

        </form>
      </div>
    </div>*/
    
    <div className="mt-10 m-auto w-2/3">
      <h1 className="mb-10 text-4xl font-bold text-center tracking-widest opacity-0 -translate-y-16 translate duration-300">
        Hospitalizácia
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
        <MultiSelect
          className="mb-8"
          label="Vyberte liek"
          placeholder="Zvoľte liek"
          data={departments.map((department) => ({
            value: department.NAZOV,
            label:  department.NAZOV,
          }))}
          searchable
          limit={100}
          clearable
          maxDropdownHeight={300}
          nothingFound="Prázdny zoznam"
          {...form.getInputProps("department")}
        />

        <Textarea
          className="mb-16"
          label="Popis"
          description="Popis oddelenia"
          radius="md"
          {...form.getInputProps("description")}
        />
        <Button
          /*onClick={sendRecipe}*/
          className="w-1/4 m-auto text-xl bg-blue-400 hover:-translate-y-1 hover:shadow-md transition-all duration-300 "
          type="submit"
        >
          Odoslať
        </Button>
      </form>
    </div>
  );
}


export default Hospitalization;
