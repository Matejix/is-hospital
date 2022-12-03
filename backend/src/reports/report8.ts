import getDBConnection from "../database";
import express, { Request, Response } from "express";

const report8 = express.Router();

report8.get("/", async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const queryResult = await connection?.execute(
    `select nazov_kraja, sum(case when f_vek(rod_cislo) <= 10 then 1 else 0 end) pocet_narodenych,
    sum(case when to_char(datum_umrtia,'YYYY') <= to_char(sysdate,'YYYY')-10 then 1 else 0 end) pocet_zosnulych
    from is_kraj 
    join is_okres using (id_kraja)
    join is_mesto using (id_okresu)
    join is_osoba using (psc) 
    join is_pacient using (rod_cislo) 
    group by nazov_kraja
    order by (pocet_narodenych +pocet_zosnulych) desc`
  );
  res.json(queryResult?.rows);
});

export default report8;
