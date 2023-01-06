import "../../styles.css";
import { useEffect, useState } from "react";
import { Calendar, TimeInput, DatePicker } from '@mantine/dates';
import { useMantineTheme, Button  } from '@mantine/core';
import { IconClock } from '@tabler/icons';
import useTokenData from "@/hooks/useTokenData";
import axios from "axios";
import {ScheduleDate} from "@/types"
import 'dayjs/locale/sk';
import { useForm } from '@mantine/form';


 
function ScheduleAdministration() {
  const [value, setValue] = useState<Date | null>(new Date());
  const [scheduleDates, setScheduleDates] = useState<ScheduleDate[] | null>(null);
  useEffect(() => {
    getSchedule();
  }, []);
  const theme = useMantineTheme();
  const employeeData = useTokenData();


  const getSchedule = () => {
    axios.post("http://localhost:3000/schedule/getSchedule", {
      id: employeeData.id_employee
    }).then((response: any) => {
        setScheduleDates(response.data);
    });
  };

  const foundDate = (date : Date) => {
    var found = false;
    scheduleDates?.map((row: ScheduleDate) => (
      (new Date(row.DAT_OD).getDate() == date.getDate()) &&
      (new Date(row.DAT_OD).getMonth() == date.getMonth()) &&
      (new Date(row.DAT_OD).getFullYear() == date.getFullYear())
      ? found = true        : null
    ));
    return found;
  };
  const sendForm = () => {
    var startDate = new Date(form.values.date);
    var endDate = new Date(form.values.date);
    startDate.setHours(form.values.start.getHours());
    startDate.setMinutes(form.values.start.getMinutes());

    if(form.values.start.getHours() > form.values.end.getHours()){
      endDate.setDate(endDate.getDate() + 1);
    };

    endDate.setHours(form.values.end.getHours());
    endDate.setMinutes(form.values.end.getMinutes());

    axios.post("http://localhost:3000/schedule/postDate", {
      startDate: startDate,
      endDate: endDate,
      id: employeeData.id_employee
    }).then((response: any) => {
        setScheduleDates(response.data);
    });


  };

  const form = useForm({
    initialValues: {
      start: new Date(),
      end: new Date(),
      date: new Date(),
    },
  });


  return <div className="FullSize flex justify-center items-center h-screen">
    <div className="w-5/6 h-5/6 drop-shadow-lg bg-white flex flex-row ">
      <div className="w-1/2">
      <Calendar
            initialMonth={new Date(2022, 10)}
            className="pt-10 pl-2"
            value={value}
            onChange={setValue}
            fullWidth
            size="xl"
            locale="sk"
            dayStyle={(date) =>
              foundDate(date)
                ? { backgroundColor: theme.colors.blue[2], color: theme.white }
                : null
            }

            // renderDay={(date) => {
            //   const day = date.getDate();
            //   return (
            //     <Indicator size={6} color="red" offset={8} disabled={!foundDate(date)}>
            //       <div>{day}</div>
            //     </Indicator>
            //   );
            // }}
            styles={(theme) => ({
              cell: {
                border: `1px solid ${
                  theme.colors.gray[2]
                }`,
              },
              day: { borderRadius: 0, height: 70, fontSize: theme.fontSizes.lg },
              weekday: { fontSize: theme.fontSizes.lg },
              weekdayCell: {
                fontSize: theme.fontSizes.xl,
                backgroundColor:
                   theme.colors.gray[0],
                border: `1px solid ${
                   theme.colors.gray[2]
                }`,
                height: 70,
              },
            })} />

      </div>
      <div className="w-1/2 ">
            <div className=" m-32 ">
              <h1 className="font-bold	text-center text-lg	text-sky-800		"> Pridať službu </h1>
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

        <DatePicker
            className="basis-1/4"
            withAsterisk
            radius="lg"
            defaultValue={new Date()}
            label="Dátum"
            locale="sk"
            {...form.getInputProps("date")}

          />
          <div className="flex items-center justify-center h-screen h-12 m-2">
              <Button variant="outline" radius="lg" size="md" onClick={sendForm}>

                    Odoslať
              </Button>
              </div>
        </div>
      </div>
    </div>
  </div>;
}

export default ScheduleAdministration;
