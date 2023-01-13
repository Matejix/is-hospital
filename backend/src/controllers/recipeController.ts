import getDBConnection from "../database";
import express, { Request, Response } from "express";
const recipeRouter = express.Router();

recipeRouter.get("/getPatients", async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const query = await connection?.execute(
    `select meno, priezvisko, rod_cislo from is_pacient join is_osoba using (rod_cislo) fetch first 1000 rows only`
  );
  var rows = JSON.parse(JSON.stringify(query?.rows));
  res.json(rows);
});

recipeRouter.get("/getMedicine", async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const query = await connection?.execute(
    `select id_kod_lieku,s.liek.nazov as "NAZOV" from is_lieky s`
  );
  var rows = JSON.parse(JSON.stringify(query?.rows));
  res.json(rows);
});

recipeRouter.post("/", async (req: Request, res: Response) => {
  const { description, id_employee, id_patient, medicine } = req.body;
  //console.log(description, id_employee, id_patient, medicine);

  const connection = await getDBConnection();
  const query = await connection?.execute(
    `insert into is_predpis (id_predpisu,popis,rod_cislo,id_zamestnanec) values ((select max(id_predpisu) + 1 from is_predpis), '${description}', '${id_patient}', ${id_employee})`
  );
  //console.log(query);
  medicine.map((medicament: any) => {
    connection?.execute(
      `insert into is_predpisane_lieky (id_predpisu,id_kod_lieku) values ((select max(id_predpisu) from is_predpis), '${medicament}')`
    );
  });
});

export default recipeRouter;
