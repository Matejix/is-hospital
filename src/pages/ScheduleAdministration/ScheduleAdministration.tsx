import "../../styles.css";
import { useEffect, useState } from "react";
import { Calendar, TimeInput, DatePicker } from '@mantine/dates';
import { useMantineTheme, Button, Indicator, Select, createStyles, Table, ScrollArea } from '@mantine/core';
import { IconClock, IconSettings, IconX } from '@tabler/icons';
import useTokenData from "@/hooks/useTokenData";
import axios from "axios";
import { ScheduleEmployeeDate, EmployeeNames, Dates } from "@/types"
import 'dayjs/locale/sk';
import { useForm } from '@mantine/form';
import { ActionIcon } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
        }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));


function ScheduleAdministration() {
  const [value, setValue] = useState<Date | null>(new Date());
  const [employees, setEmployees] = useState<EmployeeNames[]>([]);
  const [scheduleEmployeeDates, setScheduleEmployeeDates] = useState<Dates[] | null>(null);
  const [scheduleOnDate, setScheduleOnDate] = useState<ScheduleEmployeeDate[]>([]);
  const [notScheduledEmployees, setNotScheduledEmployees] = useState<EmployeeNames[]>([]);
  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {
    getSchedule();
    getEmployees();
    getScheduleOnDate();
    notScheduledEmp();
  }, []);

  const { classes, cx } = useStyles();

  useEffect(() => {
    getScheduleOnDate();
    notScheduledEmp();
  }, [value]);

  useEffect(() => {
    notScheduledEmp();
  }, [scheduleOnDate]);

  const theme = useMantineTheme();
  const employeeData = useTokenData();

  const getSchedule = () => {
    axios.get("http://localhost:3000/scheduleAdministration/getAllSchedules").then((response: any) => {
      setScheduleEmployeeDates(response.data);
    });
  };

  const getScheduleOnDate = () => {
    if (value) {
      axios.post("http://localhost:3000/scheduleAdministration/getScheduleOnDate", {
        year: value?.getFullYear(),
        month: (value.getMonth() + 1),
        day: value.getDate()
      }).then((response: any) => {
        setScheduleOnDate(response.data);
        notScheduledEmp();
      });
    }
  };

  const getEmployees = () => {
    axios.get("http://localhost:3000/scheduleAdministration/getEmployees").then((response: any) => {
      setEmployees(response.data);
    });
  };

  const notScheduledEmp = () => {

    if (value && scheduleOnDate) {
      var employeesNotOnDate = [...employees];
      for (let i = 0; i < scheduleOnDate.length; i++) {
        var row = scheduleOnDate[i];
        for (let j = 0; j < employeesNotOnDate.length; j++) {
          if (row.ID_ZAMESTNANEC == employeesNotOnDate[j].ID_ZAMESTNANEC) {
            employeesNotOnDate.splice(j, 1);
            break;
          }
        }
      }
      setNotScheduledEmployees(employeesNotOnDate);
    }
  };
  const deleteSchedule = (row: ScheduleEmployeeDate) => {
    axios.post("http://localhost:3000/scheduleAdministration/deleteSchedule", {
      id: row.ID_DOCHADZKY
    }).then((response: any) => {
      getSchedule();
      getScheduleOnDate()
      notScheduledEmp();
    });
  };

  const foundDate = (date: Date) => {
    var found = false;
    scheduleEmployeeDates?.map((row: Dates) => (
      (new Date(row.DAT).getDate() == date.getDate()) &&
        (new Date(row.DAT).getMonth() == date.getMonth()) &&
        (new Date(row.DAT).getFullYear() == date.getFullYear())
        ? found = true : null
    ));
    return found;
  };
  const sendForm = () => {
    if (value) {
      var startDate = new Date(value);
      var endDate = new Date(value);
      startDate.setHours(form.values.start.getHours());
      startDate.setMinutes(form.values.start.getMinutes());

      if (form.values.start.getHours() > form.values.end.getHours()) {
        endDate.setDate(endDate.getDate() + 1);
      };
      endDate.setHours(form.values.end.getHours());
      endDate.setMinutes(form.values.end.getMinutes());

      console.log(startDate);
      var start = startDate.getDate() + "." + (startDate.getUTCMonth() + 1) + "." + startDate.getFullYear() +
        " " + startDate.getHours() + ":" + startDate.getMinutes() + ":00";
      var end = endDate.getDate() + "." + (endDate.getUTCMonth() + 1) + "." + endDate.getFullYear() +
        " " + endDate.getHours() + ":" + endDate.getMinutes() + ":00";

      axios.post("http://localhost:3000/scheduleAdministration/postSchedule", {
        startDate: start,
        endDate: end,
        id: form.values.id_zamestnanec
      }).then((response: any) => {
        getSchedule();
        getScheduleOnDate();
        notScheduledEmp();
        form.reset();
      });
    }
  };

  const form = useForm({
    initialValues: {
      start: new Date(),
      end: new Date(),
      date: new Date(),
      id_zamestnanec: 0
    },
    validate: {
      id_zamestnanec: (value) => (value === null ? "Zvoľte zamestnanca" : null),
    },
  });

  const rows = scheduleOnDate.map((row) => (
    <tr key={row.ID_DOCHADZKY}>
      <td>{row.ID_ZAMESTNANEC}</td>

      <td>{row.CELE_MENO}</td>
      <td>{new Date(row.DAT_OD).getHours() > 10 ? (new Date(row.DAT_OD).toLocaleTimeString()).toString().substring(0, 5) : (new Date(row.DAT_OD).toLocaleTimeString()).toString().substring(0, 4)}</td>
      <td>{new Date(row.DAT_DO).getHours() > 10 ? (new Date(row.DAT_DO).toLocaleTimeString()).toString().substring(0, 5) : (new Date(row.DAT_DO).toLocaleTimeString()).toString().substring(0, 4)}</td>
      <td>{row.ODDELENIE ? row.ODDELENIE : ""}</td>
      <td onClick={() => deleteSchedule(row)}>  <ActionIcon variant="subtle"><IconX size={16} /></ActionIcon></td>


    </tr>
  ));


  return <div className="FullSize flex justify-center items-center h-screen">
    <div className="w-5/6 h-5/6 drop-shadow-lg bg-white flex flex-row ">
      <div className="w-1/2 mr-2">
        <Calendar
          initialMonth={new Date(2022, 12)}
          className="pt-10 pl-2"
          value={value}
          onChange={setValue}
          fullWidth
          size="xl"
          locale="sk"

          renderDay={(date) => {
            const day = date.getDate();
            return (
              <Indicator size={6} color="red" offset={8} disabled={!foundDate(date)}>
                <div>{day}</div>
              </Indicator>
            );
          }}

          styles={(theme) => ({
            cell: {
              border: `1px solid ${theme.colors.gray[2]
                }`,
            },
            day: { borderRadius: 0, height: 70, fontSize: theme.fontSizes.lg },
            weekday: { fontSize: theme.fontSizes.lg },
            weekdayCell: {
              fontSize: theme.fontSizes.xl,
              backgroundColor:
                theme.colors.gray[0],
              border: `1px solid ${theme.colors.gray[2]
                }`,
              height: 70,
            },
          })} />

      </div>
      <div className="w-1/2 border-l-2">
        <div className="p-2 border-b-2 mb-2">
          <div className="px-10">
            <h1 className="font-bold	text-center text-lg	text-sky-800"> Zoznam služieb pre deň  {value?.toLocaleDateString()}</h1>
            <ScrollArea sx={{ height: 250 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
              <Table sx={{ minWidth: 150 }}>
                <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                  <tr>
                    <th>Id</th>
                    <th>Meno</th>
                    <th>Od</th>
                    <th>Do</th>
                    <th>Oddelenie</th>
                    <th>Zrušiť</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </Table>
            </ScrollArea>
          </div>
        </div>
        <div className=" mx-32 ">
          <div className="max-w-xs	">
            <h1 className="font-bold	text-center text-lg	text-sky-800		"> Pridať službu </h1>
            <Select
              className="basis-1/2"
              withAsterisk
              label="Zvoľte zamestnanca"
              placeholder="Zvoľte zamestnanca"
              data={notScheduledEmployees.map((employee) => ({
                value: employee.ID_ZAMESTNANEC,
                label:
                  "ID: " + employee.ID_ZAMESTNANEC +
                  " - " +
                  employee.CELE_MENO
              }))}
              searchable
              maxDropdownHeight={400}
              radius="lg"
              nothingFound="Prázdny zoznam"
              {...form.getInputProps("id_zamestnanec")}
            />
            <TimeInput
              label="Čas začiatku"
              placeholder="Pick time"
              icon={<IconClock size={16} />}
              defaultValue={new Date()}
              withAsterisk
              radius="lg"
              {...form.getInputProps("start")}


            />

            <TimeInput
              label="Čas konca"
              placeholder="Pick time"
              icon={<IconClock size={16} />}
              defaultValue={new Date()}
              withAsterisk
              radius="lg"
              {...form.getInputProps("end")}

            />

            {/* <DatePicker
            className="basis-1/4"
            withAsterisk
            radius="lg"
            defaultValue={value}
            label="Dátum"
            locale="sk"
            {...form.getInputProps("date")}            

          /> */}
            <div className="flex items-center justify-center h-screen h-12 m-2">
              <Button variant="outline" radius="lg" size="md" onClick={sendForm}>
                Odoslať
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>;
}

export default ScheduleAdministration;
