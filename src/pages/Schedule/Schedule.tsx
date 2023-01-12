import "../../styles.css";
import { useEffect, useState } from "react";
import { Calendar } from '@mantine/dates';
import { useMantineTheme ,Indicator } from '@mantine/core';
import { IconClock } from '@tabler/icons';
import useTokenData from "@/hooks/useTokenData";
import axios from "axios";
import {ScheduleDate} from "@/types"
import 'dayjs/locale/sk';
import { useForm } from '@mantine/form';


 
function Schedule() {
  const [value, setValue] = useState<Date | null>(new Date());
  const [selected, setSelected] = useState<ScheduleDate | null>(null);
  const [scheduleDates, setScheduleDates] = useState<ScheduleDate[] | null>(null);
  const [futureScheduleDates, setFutureScheduleDates] = useState<ScheduleDate[] | null>(null);

  useEffect(() => {
    getFutureSchedule()
    getSchedule();
    dateInfo();
    console.log(value);

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

  const getFutureSchedule = () => {
    axios.post("http://localhost:3000/schedule/getFutureSchedule", {
      id: employeeData.id_employee
    }).then((response: any) => {
        setFutureScheduleDates(response.data);
    });
  };

  useEffect((
  ) => { 
    dateInfo();
  }, [value]);

  const showing = () => {
    var found = false;
    if(value){
    scheduleDates?.map((row: ScheduleDate) => (
      (new Date(row.DAT_OD).getDate() == value.getDate()) &&
      (new Date(row.DAT_OD).getMonth() == value.getMonth()) &&
      (new Date(row.DAT_OD).getFullYear() == value.getFullYear())
      ? found = true        : null
    ));
    futureScheduleDates?.map((row: ScheduleDate) => (
      (new Date(row.DAT_OD).getDate() == value.getDate()) &&
      (new Date(row.DAT_OD).getMonth() == value.getMonth()) &&
      (new Date(row.DAT_OD).getFullYear() == value.getFullYear())
      ? found = true        : null
    ));

      return found;
    } else {
      return false;
    }
  }; 

  const FutureSchedule = () => {
    var result = false;
    if(value){
      if(value > new Date())
        result = true;
    } 
    return result;
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

  const foundFutureDate = (date : Date) => {
    var found = false;
    futureScheduleDates?.map((row: ScheduleDate) => (
      (new Date(row.DAT_OD).getDate() == date.getDate()) &&
      (new Date(row.DAT_OD).getMonth() == date.getMonth()) &&
      (new Date(row.DAT_OD).getFullYear() == date.getFullYear())
      ? found = true        : null
    ));
    return found;
  }; 
 
  const dateInfo = () => {
    if(scheduleDates && value){

      for (let i = 0; i < scheduleDates.length; i++) {
        var row = scheduleDates[i];
          if( (new Date(row.DAT_OD).getDate() == value.getDate()) &&
          (new Date(row.DAT_OD).getMonth() == value.getMonth()) &&
          (new Date(row.DAT_OD).getFullYear() == value.getFullYear()))
        {
          setSelected(row);
        }
      }
  }
  if(futureScheduleDates && value){

    for (let i = 0; i < futureScheduleDates.length; i++) {
      var row = futureScheduleDates[i];
        if( (new Date(row.DAT_OD).getDate() == value.getDate()) &&
        (new Date(row.DAT_OD).getMonth() == value.getMonth()) &&
        (new Date(row.DAT_OD).getFullYear() == value.getFullYear()))
      {
        setSelected(row);
      }
    }
}
}; 
  

  return <div className="FullSize flex justify-center items-center h-screen">
    <div className="w-5/6 h-5/6 drop-shadow-lg bg-white flex flex-row ">
      <div className="w-1/2">
      <Calendar
            initialMonth={new Date(2022, 12)}
            className="pt-10 pl-2 pr-2"
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

            renderDay={(date) => {
              const day = date.getDate();
              return (
                <Indicator size={6} color="red" offset={8} disabled={!foundFutureDate(date)}>
                  <div>{day}</div>
                </Indicator>
              );
            }}
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
      <div className="w-1/2 border-l-2	">
            <div className=" m-10 mt-56 ">
              <h1 className="font-bold	text-center text-lg	text-sky-800 mb-2"> {FutureSchedule() ? "Náplánovaná služba" : "Služba dňa"} {value?.toLocaleDateString()}  </h1> 
              <h2 className="font-semibold text-md text-center"> Na oddelení: { selected && showing() ?  selected.ODDELENIE : ''}</h2> 
              <h2 className="font-semibold text-md text-center"> Od: { selected && showing() ? new Date(selected.DAT_OD).toLocaleTimeString() : ""}</h2> 
              <h2 className="font-semibold text-md text-center"> Do: { selected && showing() ? new Date(selected.DAT_DO).toLocaleTimeString() : ""}</h2> 


            </div>
      </div>
    </div>
  </div>;
}

export default Schedule;
