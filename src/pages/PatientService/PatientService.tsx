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
  ActionIcon,
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
}));

interface RowData {
  MENO: string;
  PRIEZVISKO: string;
  ROD_CISLO: string;
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
  useEffect(() => {
    getUsers();
  }, []);
  const [patients, setPatients] = useState<RowData[] | null>(null);
  const getUsers = () => {
    axios
      .get("http://localhost:3000/patientservice/getPatients")
      .then((response: any) => {
        console.log(response);
        setPatients(response.data);
      });
  };

  const [choosedPerson, setChoosedPerson] = useState(false);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(patients);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  useEffect(() => {
    if (patients !== null && sortedData === null && sortBy === null) {
      setSortedData(patients);
    }
  }, [patients]);

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
    console.log(choosedPerson);
    alert(row.MENO + " " +row.PRIEZVISKO);
    setChoosedPerson(true);
    console.log(choosedPerson);
  };
  
  const rows = sortedData?.map((row: any) => (
    <tr key={`${row.MENO}-${row.PRIEZVISKO}-${row.ROD_CISLO}`} >
      <td onClick={() => choosePerson(row)}>{row.MENO}</td>
      <td onClick={() => choosePerson(row)}>{row.PRIEZVISKO}</td>
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
                Delete patient
              </Menu.Item>
            </Menu.Dropdown>
          </Menu></td>
    </tr>
  ));
  
  return (
    <div className="PatientsInfo">
      <div className="TableBlock">
        <ScrollArea>
          <TextInput
            placeholder="Search by any field"
            mb="md"
            icon={<IconSearch size={14} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
          />
          <Table
            horizontalSpacing="xs"
            verticalSpacing="xs"
            highlightOnHover
            sx={{ tableLayout: "fixed", minWidth: 200 }}
          >
            <thead >
              <tr >
                <Th 
                  sorted={sortBy === "MENO"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("MENO")}
               
                >
                  Name
                </Th>
                <Th
                  sorted={sortBy === "PRIEZVISKO"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("PRIEZVISKO")}
                >
                  LastName
                </Th>
                <Th
                  sorted={sortBy === "ROD_CISLO"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("ROD_CISLO")}
                >
                  ID Number
                </Th>
                <td  className="rowHeader">
                  <UnstyledButton >
                    <Group position="apart">
                       <Text weight={500} size="sm">
                          Edit
                      </Text>
                    </Group>
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
                      Data is loading...
                    </Text>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </ScrollArea>
      </div>
      <div className="MoreInfo">
    
      </div>

    </div>
  );
}

export default PatientService;
