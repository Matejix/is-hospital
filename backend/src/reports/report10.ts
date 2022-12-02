import getDBConnection from "../database";
import express, { Request, Response } from "express";

const report10 = express.Router();

report10.get("/", async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const queryResult = await connection?.execute(
    `select fotografia, titul, cele_meno, tel, email, nazov, poradie from (select iz.fotografia, io.titul, io.meno || ' ' || io.priezvisko as cele_meno, iz.informacie.tel as tel, iz.informacie.email as email, itz.nazov, row_number() over(partition by itz.nazov order by to_date(iz.informacie.dat_od, 'DD.MM.YYYY') asc) as poradie from is_zamestnanec iz join is_osoba io on(io.rod_cislo = iz.rod_cislo) join is_typ_zamestnancov itz on (iz.typ_zamestnanca = itz.typ_zamestnanca) where iz.informacie.dat_do is null AND iz.fotografia is not null) where poradie IN (1,2,3)`
  );
  res.json(queryResult?.rows);
});

export default report10;
