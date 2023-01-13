import getDBConnection from "../database";
import express, { Request, Response } from "express";
const requesterRouter = express.Router();

requesterRouter.get("/getPatients", async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const query = await connection?.execute(
    `select meno, priezvisko, rod_cislo from is_pacient join is_osoba using (rod_cislo)
    fetch first 1000 rows only`
  );
  var rows = JSON.parse(JSON.stringify(query?.rows));
  res.json(rows);
});

requesterRouter.get("/getDepartment", async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const query = await connection?.execute(
    `select k.informacie_oddelenia.nazov_oddelenia as "NAZOV" from is_typ_oddelenia k`
  );
  var rows = JSON.parse(JSON.stringify(query?.rows));
  res.json(rows);
});

requesterRouter.post("/", async (req: Request, res: Response) => {
  const { description, id_employee, id_patient, department, date } = req.body;
  console.log(description, id_employee, id_patient, department, date);

  const connection = await getDBConnection();
  const query = await connection?.execute(
    `insert into is_ziadanky (id_ziadanky, popis, rod_cislo, id_zamestnanec, id_typu_oddelenia, dat_vystavenia) values ((select max(id_ziadanky) + 1 from is_ziadanky), '${description}', '${id_patient}', ${id_employee}, ${department}, to_date('${date}', 'DD.MM.YYYY'))`
  );
});

export default requesterRouter;
