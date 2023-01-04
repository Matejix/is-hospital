import {
  Button,
  MultiSelect,
  Select,
  Textarea,
  TextInput,
  LoadingOverlay
} from "@mantine/core";
import { useForm } from "@mantine/form";
import useTokenData from "@/hooks/useTokenData";
import { DatePicker } from "@mantine/dates";
import axios from "axios";
import { useEffect, useState } from "react";
import { MedicineData, PatientsData } from "@/types";
import { useLocation } from "react-router";

function Recipe() {
  const route = useLocation();
  const [patients, setPatients] = useState<PatientsData[]>([]);
  const [medicines, setMedicines] = useState<MedicineData[]>([]);
  const [loading, setLoading] = useState(false);

  const getUsers = () => {
    setLoading(true);
    axios
      .get("http://localhost:3000/recipe/getPatients")
      .then((response: any) => {
        //console.log(response);
        setPatients(response.data);
        setLoading(false);
        //console.log(route.search?.slice(1));
        form.values.id_patient = route.search.slice(1);
      });
  };

  const getMedicine = () => {
    axios
      .get("http://localhost:3000/recipe/getMedicine")
      .then((response: any) => {
        //console.log(response);
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
  //console.log(form);
  useEffect(() => getUsers(), []);
  useEffect(() => getMedicine(), []);

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
    <div className="mt-10 m-auto w-2/3" >

      <h1 className="mb-10 text-4xl font-bold text-center tracking-widest opacity-0 -translate-y-16 translate duration-300">
        Predpis lieku
        <div className="mt-2 m-auto max-w-xs h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>

      </h1>
      <form
        className="flex flex-col w-3/4 m-auto pl-6 pr-6 pt-14 pb-14 bg-white shadow-xl border-2 border-slate-100 opacity-0 translate-y-16 translate duration-300"
        onSubmit={form.onSubmit(form.reset)}
        onReset={form.onReset}
      >
        <LoadingOverlay visible={loading} overlayBlur={2} />

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
          data={medicines.map((medicine) => ({
            value: medicine.ID_KOD_LIEKU,
            label: medicine.ID_KOD_LIEKU + " " + medicine.NAZOV,
          }))}
          searchable
          limit={100}
          clearable
          maxDropdownHeight={300}
          nothingFound="Prázdny zoznam"
          {...form.getInputProps("medicine")}
        />

        <Textarea
          className="mb-8"
          label="Popis"
          description="Popis uživania lieku"
          radius="md"
          {...form.getInputProps("description")}
        />

        <Button
          onClick={sendRecipe}
          className="w-1/4 m-auto text-xl bg-blue-400 hover:-translate-y-1 hover:shadow-md transition-all duration-300 "
          type="submit"
        >
          Odoslať
        </Button>
      </form>
    </div>
  );
}

export default Recipe;
