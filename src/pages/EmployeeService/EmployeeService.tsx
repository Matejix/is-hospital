import { useEffect, useState } from "react";
import "../../styles.css";
import useTokenData from "@/hooks/useTokenData";
import { useForm } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import { EmployeeInfo, Cities, TypesOfEmployees, TypesOfDepartments, TypesOfMedics } from "@/types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  Menu,
  ActionIcon,
  Accordion,
  Tabs,
  LoadingOverlay,
  Modal,
  Button,
  Select,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconNote,
  IconReportAnalytics,
  IconTrash,
  IconDots,
  IconAlertTriangle,
  IconPencil
} from "@tabler/icons";
import axios from "axios";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
  wrapper: {
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,
    minHeight: 650,
  },

  item: {
    backgroundColor: "#ffffff",

    borderbottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
  },
  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

interface RowData {
  CELE_MENO: string;
  ID_ZAMESTNANEC: string;
  NAZOV: string;
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}
function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  );
}
function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}


var cities: Cities[] = [];
var typesOfEmployees: TypesOfEmployees[] = [];
var typesOfMedics: TypesOfMedics[] = [];
var typesOfDepartments: TypesOfDepartments[] = [];

function EmployeeService() {
  const { classes } = useStyles();

  useEffect(() => {
    getConstantValues();

    getEmployees();
  }, []);
  const [employees, setEmployees] = useState<RowData[] | null>(null);
  const [basicInfo, setBasicInfo] = useState<EmployeeInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [choosenEmployee, setChoosenEmployee] = useState("");
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(employees);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState(false);
  const [scrolled, setScrolled] = useState(false);


  const employeeData = useTokenData();


  useEffect(() => {
    if (employees)
      setChoosenEmployee(employees[0].ID_ZAMESTNANEC);
    getEmployeeInfo();

  }, [employees]);



  const getEmployees = () => {
    setLoading(true);
    axios
      .get("http://localhost:3000/employeeservice/getEmployees")
      .then((response: any) => {
        setEmployees(response.data);
        if (employees)
          setChoosenEmployee(employees[0].ID_ZAMESTNANEC);
          getEmployeeInfo();
        setLoading(false);
      });
  };


  const choosePerson = (row: RowData) => {
    setChoosenEmployee(row.ID_ZAMESTNANEC);
    getEmployeeInfo();
  };

  useEffect(() => {
    if (employees !== null && sortedData === null && sortBy === null) {
      setSortedData(employees);
      setChoosenEmployee(employees[0].ID_ZAMESTNANEC);
      getEmployeeInfo();
    }
  }, [employees]);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(
      sortData(employees || [], { sortBy: field, reversed, search })
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(employees || [], {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    );
  };


  const getEmployeeInfo = () => {
    setLoading(true);
    axios
      .post("http://localhost:3000/employeeservice/getBasicInfo", {
        id: choosenEmployee,
      })
      .then((response: any) => {
        setBasicInfo(response.data[0]);
        setLoading(false);
      });
  };

  const getConstantValues = () => {
    axios
      .get("http://localhost:3000/patientservice/getCities")
      .then((response: any) => {
        cities = response.data;
      });

    axios
      .get("http://localhost:3000/employeeservice/getTypesOfDepartments")
      .then((response: any) => {
        typesOfDepartments = response.data;

      })
    axios
      .get("http://localhost:3000/employeeservice/getTypesOfMedics")
      .then((response: any) => {
        typesOfMedics = response.data;

      })
    axios
      .get("http://localhost:3000/employeeservice/getTypesOfEmployees")
      .then((response: any) => {
        typesOfEmployees = response.data;
      })
  };
  const editEmployee = () => {
    if (basicInfo) {
      form.setValues({
        name: basicInfo.MENO, surname: basicInfo.PRIEZVISKO, birthsurname: basicInfo.RODNE_PRIEZVISKO,
        typeOfDepartment: (basicInfo.ID_TYPU_ODDELENIA),
        typeOfEmployee: (basicInfo.TYP_ZAMESTNANCA),
        typeOfMedic: (basicInfo.TYP_ZDRAVOTNIKA),
        street: basicInfo.ULICA, city: basicInfo.PSC,
        tel: basicInfo.TEL, email: basicInfo.EMAIL,
        title: basicInfo.TITUL, employmentEnd: new Date(basicInfo.DAT_DO), employmentStart: new Date(basicInfo.DAT_OD), id: basicInfo.ROD_CISLO
      });
      setOpened(true);
      setEditing(true);
    }
  };



  const form = useForm({
    initialValues: {
      name: "",
      surname: "",
      birthsurname: "",
      id: "",
      street: "",
      city: "",
      insurance: "",
      employmentStart: new Date(),
      employmentEnd: new Date(),
      title: "",
      typeOfEmployee: 0,
      typeOfMedic: "",
      typeOfDepartment: 0,
      tel: "",
      email: ""
    },
    validate: {
      name: (value) => (value.length === 0 ? "Zvoľte meno" : null),
      surname: (value) => (value.length === 0 ? "Zvoľte priezvisko" : null),
      id: (value) => (value.length === 0 || value.length > 11 ? "Zvoľte správne rodné číslo" : null),
      street: (value) => (value.length === 0 ? "Zvoľte ulicu" : null),
      city: (value) => (value.length === 0 ? "Zvoľte mesto" : null),
      insurance: (value) => (value.length === 0 ? "Zvoľte poisťovňu" : null),
      employmentStart: (value) => (value === null ? "Zvoľte dátum začiatku poistenia" : null),
    },
  });


  const sendForm = () => {
    if (editing && basicInfo) {
      var employmentEnd = '';
      var employmentStart = '';
      console.log(form.values.employmentEnd) 
      if(form.values.employmentEnd != null ){
        var end = new Date(form.values.employmentEnd);
        employmentEnd = end.getDate() + "." + (end.getUTCMonth() + 1) + "." + end.getFullYear();
      }
      var start = new Date(form.values.employmentStart);
      employmentEnd = start.getDate() + "." + (start.getUTCMonth() + 1) + "." + start.getFullYear();

      axios.post("http://localhost:3000/employeeService/editEmployee", {
        employeeId: basicInfo.ID_ZAMESTNANEC,
        id: form.values.id,
        name: form.values.name,
        surname: form.values.surname,
        birthsurname: form.values.birthsurname ? form.values.birthsurname : '',
        street: form.values.street,
        city: form.values.city,
        employmentStart: employmentStart,
        employmentEnd: employmentEnd,
        title: form.values.title ? form.values.title : '',
        typesOfEmployee: form.values.typeOfEmployee,
        typesOfDepartment: form.values.typeOfDepartment,
        typesOfMedic: form.values.typeOfMedic,
        tel: form.values.tel,
        email: form.values.email
      }).then((response: any) => {
        setEditing(false);
        setOpened(false);
        form.reset();
        console.log(response.data.message);
        getEmployeeInfo();
        console.log(basicInfo);
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
      


    } else {
      var employmentEnd = '';
      var employmentStart = '';
      console.log(form.values.employmentEnd) 
      if(form.values.employmentEnd != null ){
        var end = new Date(form.values.employmentEnd);
        employmentEnd = end.getDate() + "." + (end.getUTCMonth() + 1) + "." + end.getFullYear();
      }
      var start = new Date(form.values.employmentStart);
      employmentStart = start.getDate() + "." + (start.getUTCMonth() + 1) + "." + start.getFullYear();


      axios.post("http://localhost:3000/employeeService/addEmployee", {
        id: form.values.id,
        name: form.values.name,
        surname: form.values.surname,
        birthsurname: form.values.birthsurname ? form.values.birthsurname : '',
        street: form.values.street,
        city: form.values.city,
        employmentStart: employmentStart,
        employmentEnd: employmentEnd,
        title: form.values.title ? form.values.title : '',
        typesOfEmployee: form.values.typeOfEmployee,
        typesOfDepartment: form.values.typeOfDepartment == basicInfo?.ID_TYPU_ODDELENIA ? 0 : form.values.typeOfDepartment ,
        typesOfMedic: form.values.typeOfMedic == basicInfo?.TYP_ZDRAVOTNIKA ?  0 : form.values.typeOfMedic,
        tel: form.values.tel,
        email: form.values.email
      }).then((response: any) => {
        form.reset();
        setOpened(false);
        getEmployees();
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }).catch((err) => {
        console.log(err);
        toast.warn(err.response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });;
    }

  };



  const rows = sortedData?.map((row: any) => (
    <tr key={row.ID_ZAMESTNANEC}>
      <td onClick={() => choosePerson(row)}>{row.CELE_MENO}</td>
      <td onClick={() => choosePerson(row)}>{row.ID_ZAMESTNANEC}</td>
      <td onClick={() => choosePerson(row)}>{row.NAZOV}</td>

    </tr>
  ));



  return (
    <div className="FullSize flex justify-center items-center h-screen">
      <div className="w-5/6 h-5/6 drop-shadow-lg bg-white flex flex-row ">
        <div className="w-1/2 mr-2">
          <ScrollArea className="bg-white h-full px-5 " onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
            <div>
              <Group position="right" className="mt-2">
                <Button className="drop-shadow-lg p-2" variant="outline" radius="lg" onClick={() => setOpened(true)}>Pridať zamestnanca</Button>
              </Group>
              <TextInput
                placeholder="Prehľadávať"
                mb="md"
                icon={<IconSearch size={14} stroke={1.5} />}
                value={search}
                onChange={handleSearchChange}
                className="p-2"
              />

            </div>
            <Table
              horizontalSpacing="xs"
              verticalSpacing="xs"
              highlightOnHover
              sx={{ tableLayout: "fixed", minWidth: 150 }}
            >
              <thead>
                <tr>
                  <Th
                    sorted={sortBy === "CELE_MENO"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("CELE_MENO")}
                  >
                    Meno
                  </Th>
                  <Th
                    sorted={sortBy === "ID_ZAMESTNANEC"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("ID_ZAMESTNANEC")}
                  >
                    ID
                  </Th>

                  <Th
                    sorted={sortBy === "NAZOV"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("NAZOV")}
                  >
                    Typ
                  </Th>

                </tr>
              </thead>
              <tbody>
                {rows !== undefined && rows?.length > 0 ? (
                  rows
                ) : (
                  <tr>
                    <td
                      colSpan={
                        Object.keys(employees === null ? [] : employees[0]).length
                      }
                    >
                      <Text weight={500} align="center">
                        Načítanie...
                      </Text>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </ScrollArea>
        </div>
        <div className="w-1/2 border-l-2">
          <div className="w-1/2 h-full drop-shadow-lg bg-white  fixed">
            <LoadingOverlay visible={loading} overlayBlur={2} />

            <div className="py-3 px-6 bg-slate-100	 border-b border-gray-300 flex justify-between	 ">
              <a className=" font-semibold"> Zamestnanec </a>
              <a className="text-cyan-900	"> ID: {basicInfo?.ID_ZAMESTNANEC}</a>
            </div>

            <div className="py-2 flex center-items text-sm px-10 py-10 flex flex-row">

              <div>

                <h5 className="font-bold  pb-1  text-gray-500 ">
                  Titul:{" "}
                </h5>
                <h5 className="font-bold  pb-1 text-gray-500 ">
                  Meno:{" "}
                </h5>
                <h5 className="font-bold  pb-1  text-gray-500 ">
                  Priezvisko:{" "}
                </h5>
                <h5 className="font-bold  pb-1  text-gray-500 ">
                  Rodné priezvisko:{" "}
                </h5>
                <h5 className="font-bold  pb-1  text-gray-500 ">
                  Adresa:{" "}
                </h5>
                <h5 className="font-bold  pb-1  text-gray-500 ">
                  Rodné číslo:{" "}
                </h5>
                <h5 className="font-bold  pb-1 text-gray-500 ">
                  Telefónne číslo:{" "}
                </h5>
                <h5 className="font-bold  pb-1  text-gray-500 ">
                  E-mail:{" "}
                </h5>
                <h5 className="font-bold  pb-1  text-sky-800 ">
                  Typ zamestnanca:{" "}
                </h5>
                <h5 className="font-bold  pb-1  text-sky-800 ">
                  Oddelenie:{" "}
                </h5>
                <h5 className="font-bold  pb-1  text-sky-800 ">
                  Zamestnaný od:{" "}
                </h5>
                <h5 className="font-bold  pb-1  text-sky-800 ">
                  Zamestnaný do:{" "}
                </h5>
              </div>
              <div className="text-md pl-10">
                <h5 className="pb-1">
                  {" "}
                  {basicInfo?.TITUL ? basicInfo.TITUL : "-"}{" "}
                </h5>
                <h5 className="pb-1">
                  {" "}
                  {basicInfo?.MENO ? basicInfo.MENO : "-"}{" "}
                </h5>
                <h5 className="pb-1">
                  {" "}
                  {basicInfo?.PRIEZVISKO ? basicInfo.PRIEZVISKO : "-"}{" "}
                </h5>
                <h5 className="pb-1">
                  {" "}
                  {basicInfo?.RODNE_PRIEZVISKO ? basicInfo.RODNE_PRIEZVISKO : "-"}{" "}
                </h5>
                <h5 className="pb-1">
                  {" "}
                  {basicInfo?.ULICA ? basicInfo.ULICA : "-"}{" "}
                  {basicInfo?.NAZOV_MESTA} {basicInfo?.PSC}{" "}
                </h5>
                <h5 className="pb-1">
                  {" "}
                  {basicInfo?.ROD_CISLO ? basicInfo.ROD_CISLO : "-"}{" "}
                </h5>
                <h5 className="pb-1">
                  {" "}
                  {basicInfo?.TEL ? basicInfo.TEL : "-"}{" "}
                </h5>
                <h5 className="pb-1">
                  {" "}
                  {basicInfo?.EMAIL ? basicInfo.EMAIL : "-"}{" "}
                </h5>
                <h5 className="pb-1">
                  {" "}
                  {basicInfo?.TYP ? basicInfo.TYP : "-"}{" "}
                  {basicInfo?.TYP_ZDRAVOTNIKA ? " - " + basicInfo.TYP_ZDRAVOTNIKA : ""}{" "}
                </h5>
                <h5 className="pb-1">
                  {" "}
                  {basicInfo?.NAZOV_ODDELENIA ? basicInfo.NAZOV_ODDELENIA : "-"}{" "}
                </h5>
                <h5 className="pb-1">
                  {" "}
                  {basicInfo?.DAT_OD ? new Date(basicInfo.DAT_OD).toLocaleDateString() : "-"}{" "}
                </h5>
                <h5 className="pb-1">
                  {" "}
                  {basicInfo?.DAT_DO ? new Date(basicInfo.DAT_DO).toLocaleDateString() : "-"}{" "}
                </h5>
              </div>

            </div>
            <div className="flex center-items justify-center ">
              <Button onClick={() => editEmployee()} variant="outline" radius="lg" size="md" leftIcon={<IconPencil size={16} stroke={1.5} />} >
                Upraviť
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          setEditing(false)
        }}
        size='lg'
      >
        {
          <div className="">
            <div className="border-b border-gray-500 mb-2">
              <h1 className="font-bold	text-center text-lg	text-sky-800 mb-5		"> {editing ? "Upraviť zamestnanca" : "Pridať zamestnanca"} </h1>
            </div>
            <div className="flex justify-between mb-2 space-x-3 ">
              <TextInput
                className="basis-1/6"
                radius="lg"
                label="Titul"
                {...form.getInputProps("title")}
              />
              <TextInput
                withAsterisk
                radius="lg"
                label="Meno"
                {...form.getInputProps("name")}
              />
              <TextInput
                withAsterisk
                radius="lg"
                label="Priezvisko"
                {...form.getInputProps("surname")}
              />
              <TextInput
                radius="lg"
                label="Rodné priezvisko"
                {...form.getInputProps("birthsurname")}
              />
            </div>
            <div className="flex  mb-2 space-x-3 border-b pb-2 border-gray-200 ">
              <TextInput
                withAsterisk
                disabled={editing ? true : false}
                radius="lg"
                label="Rodné číslo s lomkou"

                {...form.getInputProps("id")}
              />

            </div>

            <h1 className="	text-sky-800 text-sm font-semibold">Adresa</h1>

            <div className="flex justify-between space-x-3 pb-3 border-b border-gray-200 ">
              <TextInput
                className="basis-1/2"

                withAsterisk
                radius="lg"
                label="Ulica a číslo"
                {...form.getInputProps("street")}
              />

              <Select
                className="basis-1/2"
                withAsterisk
                radius="lg"
                label="Mesto a PSČ"
                {...form.getInputProps("city")}
                data={cities.map((city) => ({
                  value: city.PSC,
                  label:
                    city.NAZOV_MESTA + " - " + city.PSC,
                }))}
              />

            </div>

            
            <div className="flex justify-between space-x-3 pb-3 border-b border-gray-200 ">
              <TextInput
                className="basis-1/2"
                radius="lg"
                label="Telefónne číslo"
                {...form.getInputProps("tel")}
              />

              <TextInput
                className="basis-1/2"
                radius="lg"
                label="E-mail"
                {...form.getInputProps("email")}
              />

            </div>


            <div className="flex  space-x-3 pb-3       ">
              <Select
                className="basis-1/3"
                disabled={editing ? true : false}

                withAsterisk
                radius="lg"
                label="Typ zamestnanca"
                {...form.getInputProps("typeOfEmployee")}
                data={typesOfEmployees.map((emp) => ({
                  value: emp.TYP_ZAMESTNANCA,
                  label: emp.NAZOV,
                }))}
              />
              <Select
                className="basis-1/3"
                disabled={form.values.typeOfEmployee == 1 ? false : true}
                withAsterisk
                radius="lg"
                label="Typ zdravotníka"
                {...form.getInputProps("typeOfMedic")}
                data={typesOfMedics.map((medic) => ({
                  value: medic.TYP_ZDRAVOTNIKA,
                  label: medic.TYP_ZDRAVOTNIKA,
                }))}
              />
              <Select
                className="basis-1/3"
                disabled={form.values.typeOfEmployee == 1 ? false : true}

                withAsterisk
                radius="lg"
                label="Typ oddelenia"
                {...form.getInputProps("typeOfDepartment")}
                data={typesOfDepartments.map((dep) => ({
                  value: dep.ID_TYPU_ODDELENIA,
                  label:
                    dep.NAZOV_ODDELENIA,
                }))}
              />
            </div>


            <div className="flex  space-x-3 pb-3 border-b border-gray-200 ">


              <DatePicker
                withAsterisk
                radius="lg"
                label="Dátum začiatku pracovnej zmluvy"
                value={new Date()}
                locale="sk"
                {...form.getInputProps("employmentStart")}
              />
              <DatePicker
                radius="lg"
                label="Dátum ukončenia pracovnej zmluvy"
                locale="sk"
                {...form.getInputProps("employmentEnd")}
              />
            </div>


            <div className="flex items-center justify-center h-screen h-12 m-2">
              <Button variant="outline" onClick={() => sendForm()} radius="lg" size="md">
                Odoslať
              </Button>
            </div>
          </div>
        }
      </Modal>

    </div>
  );
}

export default EmployeeService;
