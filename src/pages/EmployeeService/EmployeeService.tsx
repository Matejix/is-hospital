import { useEffect, useState } from "react";
import "../../styles.css";
import useTokenData from "@/hooks/useTokenData";
import { useForm } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import { BasicInfo, EmployeeInfo, EmployeeNames } from "@/types";

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
import { Link } from "react-router-dom";
import { cL, L } from "chart.js/dist/chunks/helpers.core";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";

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

function EmployeeService() {
  const { classes } = useStyles();

  useEffect(() => {
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


  const employeeData = useTokenData();





  const getEmployees = () => {
    setLoading(true);
    axios
      .get("http://localhost:3000/employeeservice/getEmployees")
      .then((response: any) => {
        setEmployees(response.data);
        if(employees)
          setChoosenEmployee(employees[0].ID_ZAMESTNANEC);
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
          console.log(response.data);
          setBasicInfo(response.data[0]);
          setLoading(false);
          console.log(basicInfo);
        });
    };
  /* /
    const deletePatient = (row: any) => {
      if(confirm("Naozaj chcete zmazať pacienta? ")){
      axios.post("http://localhost:3000/patientservice/deletePatient", {
        id: row
      }).then((response: any) => {
        window.location.href = "/patient-service";
  
      });}
    };
  
    const editPatient = () => {
      if (basicInfo) {
        form.setValues({
          name: basicInfo.MENO, surname: basicInfo.PRIEZVISKO, birthsurname: basicInfo.RODNE_PRIEZVISKO,
          birthdate: new Date(basicInfo.DATUM_NARODENIA), deathdate: basicInfo.DATUM_UMRTIA ? new Date(basicInfo.DATUM_UMRTIA) : new Date, bloodtype: basicInfo.KRVNA_SKUPINA,
          employment: basicInfo.ZAMESTNANIE, street: basicInfo.ULICA, city: basicInfo.PSC, insurance: basicInfo.ID_POISTOVNA,
          title: basicInfo.TITUL, insuranceEnd: new Date(basicInfo.DAT_DO), insuranceStart: new Date(basicInfo.DAT_OD), id: basicInfo.ROD_CISLO
        });
        setOpened(true);
        setEditing(true);
      }
    };
  
   */

  const form = useForm({
    initialValues: {
      name: "",
      surname: "",
      birthsurname: "",
      id: "",
      birthdate: new Date(),
      deathdate: new Date(),
      bloodtype: "",
      employment: "",
      street: "",
      city: "",
      insurance: "",
      insuranceStart: new Date(),
      insuranceEnd: new Date(),
      title: ""
    },
    validate: {
      name: (value) => (value.length === 0 ? "Zvoľte meno" : null),
      surname: (value) => (value.length === 0 ? "Zvoľte priezvisko" : null),
      id: (value) => (value.length === 0 || value.length > 11 ? "Zvoľte správne rodné číslo" : null),
      street: (value) => (value.length === 0 ? "Zvoľte ulicu" : null),
      bloodtype: (value) => (value.length === 0 ? "Zvoľte krvnú skupinu" : null),
      city: (value) => (value.length === 0 ? "Zvoľte mesto" : null),
      insurance: (value) => (value.length === 0 ? "Zvoľte poisťovňu" : null),
      birthdate: (value) => (value === null ? "Zvoľte dátum narodenia" : null),
      insuranceStart: (value) => (value === null ? "Zvoľte dátum začiatku poistenia" : null),
      birthsurname: (value) => (new Date(value) > new Date() ? "Zvoľte správny dátum úmrtia" : null),
    },
  });

  /*
    const sendForm = () => {
      if (editing && basicInfo) {
        var deathdate = '';
        var insuranceEnd = '';
        var insuranceStart = '';
        var insurance = '';
    
       
        if (form.values.insurance != basicInfo.ID_POISTOVNA.toString()){
          insurance = form.values.insurance;
          var start = new Date(form.values.insuranceStart);
          insuranceStart = start.getDate() + "." + (start.getUTCMonth() + 1) + "." + start.getFullYear();
          var end = new Date(form.values.insuranceEnd);
          insuranceEnd = end.getDate() + "." + (end.getUTCMonth() + 1) + "." + end.getFullYear();
        }
        if (form.values.insuranceEnd && form.values.insuranceEnd != new Date(basicInfo.DAT_OD))
        {
            var end = new Date(form.values.insuranceEnd);
            insuranceEnd = end.getDate() + "." + (end.getUTCMonth() + 1) + "." + end.getFullYear();
        }
        if (form.values.deathdate && form.values.deathdate != new Date(basicInfo.DATUM_UMRTIA))
        {
            var end = new Date(form.values.deathdate);
            deathdate = end.getDate() + "." + (end.getUTCMonth() + 1) + "." + end.getFullYear();
        }
  
        
        axios.post("http://localhost:3000/patientService/editPatient", {
          id: form.values.id,
          name: form.values.name,
          surname: form.values.surname,
          birthsurname: form.values.birthsurname ? form.values.birthsurname : '',
          deathdate: deathdate,
          bloodtype: form.values.bloodtype,
          employment: form.values.employment ? form.values.employment : '',
          street: form.values.street,
          city: form.values.city,
          insurance: insurance,
          insuranceStart: insuranceStart,
          insuranceEnd: insuranceEnd,
          title: form.values.title ? form.values.title : '',
          insuranceId: basicInfo.ID_POISTENIA
        }).then((response: any) => {
          setEditing(false);
          setOpened(false);
          form.reset();
          console.log(response.data.message);
         
          getPatientInfo();
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
        var birth = new Date(form.values.birthdate);
        var birthdate = birth.getDate() + "." + (birth.getUTCMonth() + 1) + "." + birth.getFullYear();
        var deathdate = '';
        if (form.values.deathdate) {
          var death = new Date(form.values.deathdate);
          deathdate = death.getDate() + "." + (death.getUTCMonth() + 1) + "." + death.getFullYear();
        }
        var insurancestart = new Date(form.values.insuranceStart);
        var insurancestartdate = insurancestart.getDate() + "." + (insurancestart.getUTCMonth() + 1) + "." + insurancestart.getFullYear();
        var insuranceenddate = '';
        if (form.values.insuranceEnd) {
          var insuranceend = new Date(form.values.insuranceEnd);
          var insuranceenddate = insuranceend.getDate() + "." + (insuranceend.getUTCMonth() + 1) + "." + insuranceend.getFullYear();
        }
  
        axios.post("http://localhost:3000/patientService/addPatient", {
          name: form.values.name,
          surname: form.values.surname,
          birthsurname: form.values.birthsurname,
          id: form.values.id,
          birthdate: birthdate,
          deathdate: deathdate,
          bloodtype: form.values.bloodtype,
          employment: form.values.employment,
          street: form.values.street,
          city: form.values.city,
          insurance: form.values.insurance,
          insuranceStart: insurancestartdate,
          insuranceEnd: insuranceenddate,
          title: form.values.title,
        }).then((response: any) => {
          form.reset();
        });
      }
  
    };
  
    const birthday = () => {
      if (form.values.id && !editing && opened) {
        var id = form.values.id;
        if (id.length == 11
        ) {
          var year = form.values.id.substring(0, 2);
          var month = parseInt(form.values.id.substring(2, 4)) % 50;
          var day = form.values.id.substring(4, 6);
          if (parseInt(year, 10) > 23) {
            year = "19" + year;
          } else {
            year = "20" + year;
          }
          var birthday = month + "." + day + "." + year;
          form.values.birthdate = new Date(birthday);
        }
      }
    };*/

  const rows = sortedData?.map((row: any) => (
    <tr key={row.ID_ZAMESTNANEC}>
      <td onClick={() => choosePerson(row)}>{row.CELE_MENO}</td>
      <td onClick={() => choosePerson(row)}>{row.ID_ZAMESTNANEC}</td>
      <td onClick={() => choosePerson(row)}>{row.NAZOV}</td>
      <td>
        <Menu transition="pop" withArrow position="bottom-end">
          <Menu.Target>
            <ActionIcon>
              <IconDots size={16} stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>

            <Menu.Item icon={<IconTrash size={16} stroke={1.5} />} color="red" onClick={() => console.log(row.ROD_CISLO)}>
              Zmazať zamestnanca
            </Menu.Item>

          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ));



  return (
    <div className="PatientsInfo">
      <div className="TableBlock  m-2 mt-20 p-2 drop-shadow-lg bg-white">
        <div>
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
                  <h1 className="font-bold	text-center text-lg	text-sky-800 mb-5		"> {editing ? "Upraviť pacienta" : "Pridať pacienta"} </h1>
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
                <div className="flex  mb-2 space-x-3 ">
                  <TextInput
                    withAsterisk
                    disabled={editing ? true : false}
                    radius="lg"
                    label="Rodné číslo s lomkou"

                    {...form.getInputProps("id")}
                  />

                  <DatePicker
                    withAsterisk
                    radius="lg"
                    label="Dátum narodenia"
                    disabled={editing ? true : false}
                    locale="sk"
                    {...form.getInputProps("birthdate")}
                  />
                  <DatePicker
                    radius="lg"
                    label="Dátum úmrtia"
                    locale="sk"
                    {...form.getInputProps("deathdate")}
                  />
                </div>
                <div className="flex justify-between  space-x-3 pb-3 border-b border-gray-200 ">

                  <TextInput
                    radius="lg"
                    label="Zamestnanie"
                    {...form.getInputProps("employment")}
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


                </div>

                <h1 className="	text-sky-800 text-sm font-semibold">Aktuálne poistenie</h1>

                <div className="flex justify-between  space-x-3 pb-3 border-b border-gray-200 ">


                  <DatePicker
                    withAsterisk
                    radius="lg"
                    label="Dátum začiatku"
                    value={new Date()}
                    locale="sk"
                    {...form.getInputProps("insuranceStart")}
                  />
                  <DatePicker
                    radius="lg"
                    label="Dátum ukončenia"
                    locale="sk"
                    {...form.getInputProps("insuranceEnd")}
                  />
                </div>


                <div className="flex items-center justify-center h-screen h-12 m-2">
                  <Button variant="outline" radius="lg" size="md">
                    Odoslať
                  </Button>
                </div>
              </div>
            }
          </Modal>

          <Group position="right">
            <Button className="drop-shadow-lg p-2" variant="outline" radius="lg" onClick={() => setOpened(true)}>Pridať zamestnanca</Button>
          </Group>
        </div>
        <ScrollArea className="bg-white ">
          <TextInput
            placeholder="Prehľadávať"
            mb="md"
            icon={<IconSearch size={14} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
            className="p-2"
          />
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
                <td className="rowHeader">
                  <UnstyledButton>
                    <Text weight={500} size="xs">
                      Možnosti
                    </Text>
                  </UnstyledButton>
                </td>
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
      <div className="MoreInfo">
        <div className="grid h-screen place-items-center">
          <div className="CardInfo drop-shadow-lg bg-white  fixed">
            <LoadingOverlay visible={loading} overlayBlur={2} />

            <div className="py-3 px-6 bg-slate-100	 border-b border-gray-300 flex justify-between	 ">
              <a className=" font-semibold"> Zamestnanec </a>
              <a className="text-cyan-900	"> {basicInfo?.ROD_CISLO}</a>
            </div>

            <div className="py-2 px-6 border-b border-gray-300 flex flex-row">
              <div className="absolute left-3/4 ml-10">
                <Button variant="outline" radius="lg" size="xs" leftIcon={<IconPencil size={16} stroke={1.5} />} >
                  Upraviť
                </Button>
              </div>
              <div>

                <h5 className="font-bold text-sm pb-1  text-sky-800 ">
                  Poisťovňa:{" "}
                </h5>

                <h5 className="font-bold text-sm pb-1 text-gray-500 ">
                  Meno:{" "}
                </h5>
                <h5 className="font-bold text-sm pb-1  text-gray-500 ">
                  Priezvisko:{" "}
                </h5>
                <h5 className="font-bold text-sm pb-1  text-gray-500 ">
                  Rodné priezvisko:{" "}
                </h5>
              
                <h5 className="font-bold text-sm pb-1  text-gray-500 ">
                  Adresa:{" "}
                </h5>
                        </div>
              <div className="text-sm pl-10">
                <h5 className="pb-1 text-sky-800 font-semibold">
                  {" "}
                </h5>

                <h5 className="pb-1">
                  {" "}
                  {basicInfo?.MENO ? basicInfo.MENO : "-"}{" "}
                </h5>
                <h5 className="pb-1">
                  {" "}
                  {basicInfo?.PRIEZVISKO ? basicInfo.PRIEZVISKO : "-"}{" "}
                </h5>
                <h5 className="pb-1 text-gray-500">
                  {" "}
                  {basicInfo?.RODNE_PRIEZVISKO
                    ? basicInfo.PRIEZVISKO
                    : "-"}{" "}
                </h5>
                <h5 className="pb-1">
                  {" "}
 </h5>
                <h5 className="pb-1 text-gray-500">
                  {" "}
                      </h5>
                <h5 className="pb-1">
                  {" "}
                  {basicInfo?.ULICA ? basicInfo.ULICA : "-"}{" "}
                  {basicInfo?.NAZOV_MESTA} {basicInfo?.PSC}{" "}
                </h5>
                <h5 className="pb-1">
                             </h5>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeService;
