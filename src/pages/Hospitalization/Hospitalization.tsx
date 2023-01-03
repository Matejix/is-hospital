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
  useEffect(() => getUsers(), []);
  useEffect(() => getDeps(), []);


  return(
    <div>
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
          
          <Textarea
            label="Popis"
            description="Popis oddelenia"
            radius="md"
            {...form.getInputProps("description")}
          />

          <Button /*onClick={sendHospitalization}*/ className="bg-blue-400" type="submit">
            Odoslať
          </Button>

        </form>
      </div>
    </div>
  );
}


export default Hospitalization;
