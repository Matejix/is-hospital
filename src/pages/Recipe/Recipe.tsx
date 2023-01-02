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
import { MedicineData, PatientsData } from "@/types";

function Recipe() {
  const [patients, setPatients] = useState<PatientsData[]>([]);
  const [medicines, setMedicines] = useState<MedicineData[]>([]);

  const getUsers = () => {
    axios
      .get("http://localhost:3000/recipe/getPatients")
      .then((response: any) => {
        console.log(response);
        setPatients(response.data);
      });
  };

  const getMedicine = () => {
    axios
      .get("http://localhost:3000/recipe/getMedicine")
      .then((response: any) => {
        console.log(response);
        setMedicines(response.data);
      });
  };

  const sendRecipe = () => {
    axios
      .post("http://localhost:3000/recipe", {
        description: form.values.description,
        id_employee: form.values.id_employee,
        id_patient: form.values.id_patient,
        medicine: form.values.medicine,
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
      medicine: [],
      description: "",
    },
    validate: {
      id_patient: (value) => (value.length === 0 ? "Zvoľte pacienta" : null),
      medicine: (value) => (!value.length ? "Zvoľte nejaky liek" : null),
    },
  });
  useEffect(() => getUsers(), []);
  useEffect(() => getMedicine(), []);

  return (
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
          <MultiSelect
            label="Vyberte liek"
            placeholder="Zvoľte liek"
            data={medicines.map((medicine) => ({
              value: medicine.ID_KOD_LIEKU,
              label: medicine.ID_KOD_LIEKU + " " + medicine.NAZOV,
            }))}
            searchable
            clearable
            maxDropdownHeight={400}
            nothingFound="Prázdny zoznam"
            {...form.getInputProps("medicine")}
          />

          <Textarea
            label="Popis"
            description="Popis uživania liekov"
            radius="md"
            {...form.getInputProps("description")}
          />
          <Button onClick={sendRecipe} className="bg-blue-400" type="submit">
            Odoslať
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Recipe;
