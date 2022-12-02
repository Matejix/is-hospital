import getDBConnection from "../database";
import express, { Request, Response } from "express";

const report9 = express.Router();

report9.get("/", async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const queryResult = await connection?.execute(
    `select cele_meno, pocet_hodin, poradie from (select cele_meno, pocet_hodin, dense_rank() over(order by pocet_hodin desc) as poradie from (select iso.meno || ' ' ||iso.priezvisko as cele_meno, sum(extract(HOUR FROM (id.dat_do - id.dat_od))) as pocet_hodin from is_dochadzka id join is_oddelenia io on (id.id_typu_oddelenia = io.id_typu_oddelenia) join is_zamestnanec iz on (iz.id_zamestnanec = io.id_zamestnanec) join is_osoba iso on (iso.rod_cislo = iz.rod_cislo) group by id.id_zamestnanec, iso.meno, iso.priezvisko)) where poradie <=10`
  );
  res.json(queryResult?.rows);
});

export default report9;
