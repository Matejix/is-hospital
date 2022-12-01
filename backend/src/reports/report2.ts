import getDBConnection from "../database";
import express, { Request, Response } from "express";

const report2 = express.Router();

report2.get("/", async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const queryResult = await connection?.execute(
    `select meno, priezvisko, case when nazov = 'Zdravotnik' then nazov || ' - ' || typ_zdravotnika else nazov end as typ, 
    Cast(dat_od as date) as datum, extract(hour from dat_do-dat_od) as pocet from is_dochadzka
    join is_zamestnanec using (id_zamestnanec) 
    left join is_zdravotnik using (id_zamestnanec)
    join is_osoba using (rod_cislo)
    join is_typ_zamestnancov using (typ_zamestnanca)
    where to_char(dat_od,'hh24') between '20' and '6' 
    and to_char(dat_do,'hh24') between '0' and '6'
    order by dat_od
    `
  );
  res.json(queryResult?.rows);
});

export default report2;
