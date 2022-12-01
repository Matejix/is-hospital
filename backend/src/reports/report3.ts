import getDBConnection from "../database";
import express, { Request, Response } from "express";

const report3 = express.Router();

report3.get("/", async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const queryResult = await connection?.execute(
    `
    select meno, priezvisko, typ_zdravotnika,oddelenie,pocet from (
    select meno, priezvisko, typ_zdravotnika, o.informacie_oddelenia.nazov_oddelenia as oddelenie,
        sum(case when (extract(hour from dat_od)) > (extract(hour from dat_do)) and to_char(dat_od,'D') = 6 
            then 24 - (extract(hour from dat_od)) 
            when (extract(hour from dat_od)) > (extract(hour from dat_do)) and to_char(dat_do,'D') = 5
            then  24 - (extract(hour from dat_do))
            else (extract(hour from dat_do)) - (extract(hour from dat_od)) end  ) as pocet,
        rank() over (order by sum(case when (extract(hour from dat_od)) > (extract(hour from dat_do)) and to_char(dat_od,'D') = 6 
            then 24 - (extract(hour from dat_od)) 
            when (extract(hour from dat_od)) > (extract(hour from dat_do)) and to_char(dat_do,'D') = 5
            then  24 - (extract(hour from dat_do))
            else (extract(hour from dat_do)) - (extract(hour from dat_od)) end ) desc) as poradie
    from is_dochadzka
        join is_zamestnanec using (id_zamestnanec)
        join is_zdravotnik using (id_zamestnanec)
        join is_typ_oddelenia o using (id_typu_oddelenia) 
        join is_osoba using (rod_cislo)
    where to_char(dat_od,'D') in (5,6) or to_char(dat_do,'D') in (5,6)
    group by meno, priezvisko, typ_zdravotnika, id_zamestnanec, o.informacie_oddelenia.nazov_oddelenia)
    fetch first 15 rows only
    `
  );
  res.json(queryResult?.rows);
});

export default report3;
