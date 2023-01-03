import { useEffect, useState } from "react";
import "../../styles.css";
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
  ActionIcon, Accordion, Tabs 
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconNote,
  IconMessages,
  IconReportAnalytics,
  IconTrash,
  IconDots,
} from "@tabler/icons";
import axios from "axios";
import internal from "stream";

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

    borderbottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

interface RowData {
  CELE_MENO: string;
  ROD_CISLO: string;
}
interface BasicInfo {
  ROD_CISLO: string;
  TITUL: string;
  MENO: string;
  PRIEZVISKO: string;
  RODNE_PRIEZVISKO: string;
  ULICA: string;
  PSC: string;
  NAZOV_MESTA: string;
  DATUM_NARODENIA: Date;
  DATUM_UMRTIA: Date;
  KRVNA_SKUPINA: string;
  ZAMESTNANIE: string; 
  POISTOVNA: string;
}

interface Records {
  ID_ZAZNAM: string;
  DATUM_ZAZNAMU: Date;
  ZAZNAM: string;
  TYP: string;
  POPIS: string;
  DAVKOVANIE_MEDIKACIE: string;
  NAZOV_DIAGNOZY: string;
  VYSTAVIL: string;
}

interface Requests {
  ID_ZIADANKY: string;
  DAT_VYSTAVENIA: Date;
  POPIS: string;
  NAZOV_DIAGNOZY: string;
  VYSTAVIL: string;
  ODDELENIE: string;
}  

interface Prescriptions {
  KOD: string;
  VYSTAVIL: string;
  LIEK: string;
}  

interface TableSortProps {
  data: RowData[];
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

function MainBlockComponent() {
  return (<div>
    Main block, click on user
  </div>)
}

function PatientService() {
  const { classes } = useStyles();

  useEffect(() => {
    getUsers();
  }, []);
  const [patients, setPatients] = useState<RowData[] | null>(null);
  const [basicInfo, setBasicInfo] = useState<BasicInfo | null>(null);
  const [patientRecords, setPatientRecords] = useState<Records[] | null>(null);
  const [patientRequests, setPatientRequests] = useState<Requests[] | null>(null);
  const [patientPrescriptions, setPatientPrescriptions] = useState<Prescriptions[] | null>(null);

  const [choosenPatient, setChoosenPatient] = useState("");
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(patients);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const getUsers = () => {
    axios
      .get("http://localhost:3000/patientservice/getPatients")
      .then((response: any) => {
        setPatients(response.data);
        setChoosenPatient(response.data[0].ROD_CISLO);
      });
  };

  const getPatientInfo = () => {
    axios.post("http://localhost:3000/patientservice/getBasicInfo", {
      id: choosenPatient
    }).then((response: any) => {
        setBasicInfo(response.data[0]);
    });
  };
  
  const getPatientRecords = () => {
    axios.post("http://localhost:3000/patientservice/getListOfRecords", {
      id: choosenPatient
    }).then((response: any) => {
        setPatientRecords(response.data);
    });
  };

  const getPatientRequests = () => {
    axios.post("http://localhost:3000/patientservice/getRequests", {
      id: choosenPatient
    }).then((response: any) => {
        setPatientRequests(response.data);
    });
  };

  const getPatientPrescriptions = () => {
    axios.post("http://localhost:3000/patientservice/getPrescriptions", {
      id: choosenPatient
    }).then((response: any) => {
        setPatientPrescriptions(response.data);
    });
  };



  useEffect(() => {
    if (patients !== null && sortedData === null && sortBy === null) {
      setSortedData(patients);
      setChoosenPatient(patients[0].ROD_CISLO);
      getPatientInfo();
      getPatientRecords();
      getPatientRequests();
      getPatientPrescriptions();
    }
  }, [patients]);

  useEffect(() => {
    if (patients !== null ) {
      getPatientInfo();
    }
  }, [choosenPatient]);

  useEffect(() => {
    getPatientInfo();
  }, [basicInfo])

  useEffect(() => {
    getPatientRecords();
  }, [patientRecords])

  useEffect(() => {
    getPatientRequests();
  }, [patientRequests])

  useEffect(() => {
    getPatientPrescriptions();
  }, [patientPrescriptions])



  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(
      sortData(patients || [], { sortBy: field, reversed, search })
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(patients || [], {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    );
  };

  const choosePerson = (row : RowData) => {
    setChoosenPatient(row.ROD_CISLO);
    getPatientInfo();
  };
  
  const rows = sortedData?.map((row: any) => (
    <tr key={`${row.CELE_MENO}-${row.ROD_CISLO}`} >
      <td onClick={() => choosePerson(row)}>{row.CELE_MENO}</td>
      <td onClick={() => choosePerson(row)}>{row.ROD_CISLO}</td>
      <td><Menu transition="pop" withArrow position="bottom-end">
            <Menu.Target>
              <ActionIcon>
                <IconDots size={16} stroke={1.5} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item icon={<IconReportAnalytics size={16} stroke={1.5} />}>Pridať záznam</Menu.Item>
              <Menu.Item icon={<IconNote size={16} stroke={1.5} />}>Pridať predpis</Menu.Item>
              <Menu.Item icon={<IconTrash size={16} stroke={1.5} />} color="red">
                Zmazať pacienta
              </Menu.Item>
            </Menu.Dropdown>
          </Menu></td>
    </tr>
  ));

  const listOfRecords = patientRecords?.map((row: Records) => (
    <Accordion >
        <Accordion.Item className={classes.item} value={row.ID_ZAZNAM.toString()} >
        <Accordion.Control>
        <div className="flex justify-between	 ">
            <a >  {new Date(row.DATUM_ZAZNAMU).toLocaleDateString()} </a> 
            <a className="text-cyan-900	">           {row.ZAZNAM}</a>
          </div>
          </Accordion.Control>
        <Accordion.Panel className="text-sm">
          <p className="font-medium"> {row.TYP} </p>
          <p> {row.POPIS}</p>
          <p> {row.DAVKOVANIE_MEDIKACIE ? 'Dávkovanie medikácie: ' + row.DAVKOVANIE_MEDIKACIE : ''}</p>
          <p> {row.NAZOV_DIAGNOZY ? 'Diagnóza: ' + row.NAZOV_DIAGNOZY : ''}</p>
          <p> {row.VYSTAVIL ? 'Vystavil: ' + row.VYSTAVIL : ''}</p>
        </Accordion.Panel>
      </Accordion.Item>
           
    </Accordion>
  ));

  const listOfRequests = patientRequests?.map((row: Requests) => (
    <Accordion >
        <Accordion.Item className={classes.item} value={row.ID_ZIADANKY.toString()} >
        <Accordion.Control>
        <div className="flex justify-between	 ">
            <a >  {new Date(row.DAT_VYSTAVENIA).toLocaleDateString()} </a> 
            <a className="text-cyan-900	">           {row.ODDELENIE}</a>
          </div>
          </Accordion.Control>
        <Accordion.Panel className="text-sm">
          <p> {row.POPIS}</p>
          <p> {row.NAZOV_DIAGNOZY ? 'Diagnóza: ' + row.NAZOV_DIAGNOZY : ''}</p>
          <p> {row.VYSTAVIL ? 'Vystavil: ' + row.VYSTAVIL : ''}</p>
        </Accordion.Panel>
      </Accordion.Item>
           
    </Accordion>
  ));
  const listOfPrescriptions = patientPrescriptions?.map((row: Prescriptions) => (
    <Accordion >
        <Accordion.Item className={classes.item} value={row.KOD.toString()} >
        <Accordion.Control>
        <a className="text-cyan-900	">{row.LIEK} </a> 
          </Accordion.Control>
        <Accordion.Panel className="text-sm">
          <p> {row.VYSTAVIL ? 'Vystavil: ' + row.VYSTAVIL : ''}</p>
        </Accordion.Panel>
      </Accordion.Item>
           
    </Accordion>
  ));

  return (
    <div className="PatientsInfo">
      <div className="TableBlock">
        <ScrollArea>
          <TextInput
            placeholder="Prehľadávať"
            mb="md"
            icon={<IconSearch size={14} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
          />
          <Table
            horizontalSpacing="xs"
            verticalSpacing="xs"
            highlightOnHover
            sx={{ tableLayout: "fixed", minWidth: 150 }}
          >
            <thead >
              <tr >
               
                <Th
                  sorted={sortBy === "CELE_MENO"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("CELE_MENO")}
                >
                   Meno
                </Th>
              
                <Th
                  sorted={sortBy === "ROD_CISLO"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("ROD_CISLO")}
                >
                  Rodné číslo
                </Th>
                <td  className="rowHeader">
                  <UnstyledButton >
                    
                       <Text weight={500} size="xs">
                          Možnosti
                      </Text>
                    
                  </UnstyledButton>
                </td>
              </tr>
            </thead>
            <tbody >
              {rows !== undefined && rows?.length > 0 ? (
                rows
              ) : (
                <tr >
                  <td 
                    colSpan={
                      Object.keys(patients === null ? [] : patients[0]).length
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
        <div className="CardInfo drop-shadow-lg bg-white    fixed">
          <div className="py-3 px-6 bg-slate-100	 border-b border-gray-300 flex justify-between	 ">
            <a className=" font-semibold"> Zdravotná karta </a> 
            <a className="text-cyan-900	"> {basicInfo?.ROD_CISLO}</a>
          </div>
          <div className="py-2 px-6 border-b border-gray-300 flex flex-row">
            <div >
            <h5 className="font-bold text-sm pb-1  text-sky-800 ">Poisťovňa: </h5>

              <h5 className="font-bold text-sm pb-1 text-gray-500 ">Meno: </h5>
              <h5 className="font-bold text-sm pb-1  text-gray-500 ">Priezvisko: </h5>
              <h5 className="font-bold text-sm pb-1  text-gray-500 ">Rodné priezvisko: </h5>
              <h5 className="font-bold text-sm pb-1  text-gray-500 ">Dátum narodenia: </h5>
              <h5 className="font-bold text-sm pb-1  text-gray-500 ">Dátum úmrtia: </h5>
              <h5 className="font-bold text-sm pb-1  text-gray-500 ">Krvná skupina: </h5>
              <h5 className="font-bold text-sm pb-1  text-gray-500 ">Adresa: </h5>
              <h5 className="font-bold text-sm pb-1  text-gray-500 ">Zamestnanie: </h5>

            </div>
            <div className="text-sm pl-10">
              <h5 className="pb-1 text-sky-800 font-semibold"> {basicInfo?.POISTOVNA ? basicInfo.POISTOVNA : "-"} </h5>

              <h5 className="pb-1"> {basicInfo?.MENO ? basicInfo.MENO : "-" } </h5>
              <h5 className="pb-1"> {basicInfo?.PRIEZVISKO ? basicInfo.PRIEZVISKO : "-"} </h5>
              <h5 className="pb-1 text-gray-500"> {basicInfo?.RODNE_PRIEZVISKO ? basicInfo.PRIEZVISKO : "-"} </h5>
              <h5 className="pb-1"> {basicInfo?.DATUM_NARODENIA ?  new Date(basicInfo.DATUM_NARODENIA).toLocaleDateString() : "-"}</h5>
              <h5 className="pb-1 text-gray-500"> {basicInfo?.DATUM_UMRTIA ?  new Date(basicInfo.DATUM_NARODENIA).toLocaleDateString() : "-"}</h5>
              <h5 className="pb-1"> {basicInfo?.KRVNA_SKUPINA} </h5>
              <h5 className="pb-1"> {basicInfo?.ULICA ? basicInfo.ULICA : "-"} {basicInfo?.NAZOV_MESTA} {basicInfo?.PSC}  </h5>
              <h5 className="pb-1"> {basicInfo?.ZAMESTNANIE ? basicInfo.ZAMESTNANIE : "-"} </h5>
            </div>
          </div>
          <div >

          <Tabs  defaultValue="Records">
              <Tabs.List className=" px-6 bg-slate-100	  ">
                <Tabs.Tab value="Records">Záznamy</Tabs.Tab>
                <Tabs.Tab value="Requests">Žiadanky</Tabs.Tab>
                <Tabs.Tab value="Prescription">Predpisy</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="Records" pt="xs">
              <div className="records overflow-y-auto"          >
                {listOfRecords}
             </div>
              </Tabs.Panel>

              <Tabs.Panel value="Requests" pt="xs">
                {listOfRequests}
              </Tabs.Panel>

              <Tabs.Panel value="Prescription" pt="xs">
                {listOfPrescriptions}
              </Tabs.Panel>
            </Tabs>


          </div>
          
        </div>
      </div>
      </div>
    </div>
  );
}

export default PatientService;
