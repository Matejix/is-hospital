import getDBConnection from "../database";
import express, { Request, Response } from "express";



const scheduleAdministrationService = express.Router();


   scheduleAdministrationService.get("/getAllSchedules", async (req: Request, res: Response) => {
   const connection = await getDBConnection();
  
   const query = await connection?.execute(
      `select id_dochadzky, id_zamestnanec, x.informacie_oddelenia.nazov_oddelenia as oddelenie, titul || ' ' || meno || ' ' || priezvisko as cele_meno,  dat_od, dat_do from is_dochadzka 
      left join is_typ_oddelenia x using (id_typu_oddelenia)
      join is_zamestnanec using (id_zamestnanec)
      join is_osoba using (rod_cislo)`
   );
   if(query?.rows != undefined){
   var rows = JSON.parse(JSON.stringify(query?.rows)); 
   res.json(rows);
   }
   });

   scheduleAdministrationService.get("/getEmployees", async (req: Request, res: Response) => {
      const connection = await getDBConnection();
     
      const query = await connection?.execute(
         `select id_zamestnanec, titul || ' ' || meno || ' ' || priezvisko as cele_meno from is_zamestnanec
         join is_osoba using (rod_cislo)`
      );
      if(query?.rows != undefined){
      var rows = JSON.parse(JSON.stringify(query?.rows)); 
      res.json(rows);
      }
      });

   scheduleAdministrationService.post("/postSchedule", async (req: Request, res: Response) => {
    const {startDate, endDate, id} = req.body;
    const connection = await getDBConnection();
    console.log(startDate);
    console.log(endDate);
    console.log(id)

    const queryID = await connection?.execute(
      `select max(id_dochadzky) as id from is_dochadzka`
   );
   if(queryID?.rows != undefined){
    
      var obj = JSON.parse(JSON.stringify(queryID?.rows));
      var id_dochadzky = obj[0].ID + 1;
      const queryDepartment = await connection?.execute(
         `select distinct id_typu_oddelenia as id from is_dochadzka where id_zamestnanec = ${id}`
      );
      if(queryDepartment?.rows != undefined){
         var obj = JSON.parse(JSON.stringify(queryDepartment?.rows));

         if( queryDepartment?.rows.length == 0 || obj[0].ID == "null" )
         {
            const query = await connection?.execute(
               `insert into is_dochadzka (id_dochadzky,dat_od,dat_do,id_zamestnanec) values (
               ${id_dochadzky},to_timestamp('${startDate}','DD.MM.YYYY HH24:MI:SS'),to_timestamp('${endDate}','DD.MM.YYYY HH24:MI:SS'), ${id}) `
            );
            await connection?.commit().then(() => {
               console.log("oki");
               res.status(200).json({ message: "Registration was successful!" });
            });
         } else {
            var id_oddelenia = obj[0].ID ;

            const query = await connection?.execute(
               `insert into is_dochadzka (id_dochadzky,dat_od,dat_do,id_zamestnanec,id_typu_oddelenia) values (
               ${id_dochadzky},to_timestamp('${startDate}','DD.MM.YYYY HH24:MI:SS'),to_timestamp('${endDate}','DD.MM.YYYY HH24:MI:SS'), ${id},${id_oddelenia}) `
            );
            await connection?.commit().then(() => {
               console.log("oki");
               res.status(200).json({ message: "Registration was successful!" });
            });
         }
      }
   
   }


   /* const query = await connection?.execute(
       insert into is_dochadzka (id_dochadzky,dat_od,dat_do,id_zamestnanec, id_typ_oddelenia) values ()
       to_timestamp(' ${startDate.}	7	:00:00	','DD.MM.YYYY HH24:MI:SS'),to_timestamp('	15.11.2022	16	:00:00	','DD.MM.YYYY HH24:MI:SS') 
       
       (	403	,to_timestamp('	15.11.2022	7	:00:00	','DD.MM.YYYY HH24:MI:SS'),to_timestamp('	15.11.2022	16	:00:00	','DD.MM.YYYY HH24:MI:SS'),	44				,	1	);
       = ${id}`
    );
    if(query?.rows != undefined){
    var rows = JSON.parse(JSON.stringify(query?.rows));
    res.json(rows);
    }*/
    }
    
    );


export default scheduleAdministrationService;
