import getDBConnection from "../database";
import express, { Request, Response } from "express";
const profileRouter = express.Router();

interface Row {
  FOTOGRAFIA: Buffer;
  TITUL: string;
  CELE_MENO: string;
  TEL: string;
  EMAIL: string;
  NAZOV: string;
  PORADIE: string;
}

// profileRouter.post("/", async (req: Request, res: Response) => {
//   const { id_employee } = req.body;
//   console.log("ID je: ", id_employee);
// });

profileRouter.post("/", async (req: Request, res: Response) => {
  const { id_employee } = req.body;
  const connection = await getDBConnection();
  const queryResult = await connection?.execute(
    `select fotografia, titul, cele_meno, tel, email, nazov, poradie from (select iz.fotografia, io.titul, io.meno || ' ' || io.priezvisko as cele_meno, iz.informacie.tel as tel, iz.informacie.email as email, itz.nazov, row_number() over(partition by itz.nazov order by to_date(iz.informacie.dat_od, 'DD.MM.YYYY') asc) as poradie from is_zamestnanec iz join is_osoba io on(io.rod_cislo = iz.rod_cislo) join is_typ_zamestnancov itz on (iz.typ_zamestnanca = itz.typ_zamestnanca) where id_zamestnanec = ${id_employee})`
  );

  const data = (queryResult?.rows as Row[]).map((row) => ({
    ...row,
    FOTOGRAFIA: row.FOTOGRAFIA.toString("base64"),
  }));

  res.json(data[0]);
});

export default profileRouter;
