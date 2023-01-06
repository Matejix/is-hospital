import getDBConnection from "../database";
import express, { Request, Response } from "express";



const patientServiceRouter = express.Router();

patientServiceRouter.post("/getSchedule", async (req: Request, res: Response) => {
  const {id} = req.body;
  const connection = await getDBConnection();
 
  const query = await connection?.execute(
     `select x.informacie_oddelenia.nazov_oddelenia as oddelenie,  dat_od, dat_do from is_dochadzka 
     join is_typ_oddelenia x using (id_typu_oddelenia)
     where ID_ZAMESTNANEC = ${id} and dat_od <= sysdate`
  );
  if(query?.rows != undefined){
  var rows = JSON.parse(JSON.stringify(query?.rows)); 
  res.json(rows);
  }
  });

  patientServiceRouter.post("/getFutureSchedule", async (req: Request, res: Response) => {
   const {id} = req.body;
   const connection = await getDBConnection();
  
   const query = await connection?.execute(
      `select x.informacie_oddelenia.nazov_oddelenia as oddelenie,  dat_od, dat_do from is_dochadzka 
      join is_typ_oddelenia x using (id_typu_oddelenia)
      where ID_ZAMESTNANEC = ${id} and dat_od > sysdate`
   );
   if(query?.rows != undefined){
   var rows = JSON.parse(JSON.stringify(query?.rows)); 
   res.json(rows);
   }
   });

  patientServiceRouter.post("/postDate", async (req: Request, res: Response) => {
    const {startDate, endDate, id} = req.body;
    const connection = await getDBConnection();
    console.log(startDate);
    console.log(endDate);
    console.log()

    /*const query = await connection?.execute(
       `insert into is_dochadzka (id_dochadzky,dat_od,dat_do,id_zamestnanec, id_typ_oddelenia) as select count(*)+1,
       to_timestamp(' ${startDate.}	7	:00:00	','DD.MM.YYYY HH24:MI:SS'),to_timestamp('	15.11.2022	16	:00:00	','DD.MM.YYYY HH24:MI:SS')  from is is_dochadzka;
       
       (	403	,to_timestamp('	15.11.2022	7	:00:00	','DD.MM.YYYY HH24:MI:SS'),to_timestamp('	15.11.2022	16	:00:00	','DD.MM.YYYY HH24:MI:SS'),	44				,	1	);
       = ${id}`
    );
    if(query?.rows != undefined){
    var rows = JSON.parse(JSON.stringify(query?.rows));
    res.json(rows);
    }*/
    });


export default patientServiceRouter;
