import getDBConnection from "../database";
import express, { Request, Response } from "express";

const report9 = express.Router();

report9.get("/", async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const queryResult = await connection?.execute(
    `select cele_meno, pocet_hodin, poradie from (select cele_meno, pocet_hodin, dense_rank() over(order by pocet_hodin desc) as poradie from (select meno || ' ' || priezvisko as cele_meno, sum(extract(HOUR FROM (dat_do - dat_od))) as pocet_hodin from is_dochadzka join is_zamestnanec using (id_zamestnanec) join is_zdravotnik using (id_zamestnanec) join is_typ_oddelenia io using (id_typu_oddelenia) join is_osoba using (rod_cislo) group by id_zamestnanec, meno, priezvisko)) where poradie <=10`
  );
  res.json(queryResult?.rows);
});

export default report9;
