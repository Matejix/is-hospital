import getDBConnection from "../database";
import express, { Request, Response } from "express";
const hospitalizationController = express.Router();

hospitalizationController.get("/getPatients", async (req: Request, res: Response) => {
    const connection = await getDBConnection();

    const query = await connection?.execute(
      `select meno, priezvisko, rod_cislo, ulica, nazov_mesta, nazov from is_pacient join is_osoba using (rod_cislo)
       join is_mesto using (psc) join is_poistenia using(rod_cislo) join is_poistovna using(id_poistovna) fetch first 1000 rows only`
    );
    var rows = JSON.parse(JSON.stringify(query?.rows));
    res.json(rows);
});

hospitalizationController.get("/getDepartments", async (req: Request, res: Response) => {
  const connection = await getDBConnection();

  const query = await connection?.execute(
    `select o.informacie_oddelenia.nazov_oddelenia as "NAZOV", o.informacie_oddelenia.popis_oddelenia as "POPIS" 
     from is_typ_oddelenia o fetch first 1000 rows only`
  );
  var rows = JSON.parse(JSON.stringify(query?.rows));
  res.json(rows);
});

hospitalizationController.get("/getReportTypes", async (req: Request, res: Response) => {
  const connection = await getDBConnection();

  const query = await connection?.execute(
    `select typ_spravy from is_sprava o fetch first 15 rows only`
  );
  var rows = JSON.parse(JSON.stringify(query?.rows));
  res.json(rows);
});


hospitalizationController.get("/getDiagnoses", async (req: Request, res: Response) => {
  const connection = await getDBConnection();

  const query = await connection?.execute(
    `select nazov from is_diagnoza fetch first 100 rows only`
  );
  var rows = JSON.parse(JSON.stringify(query?.rows));
  res.json(rows);
});


hospitalizationController.get("/getCheckups", async (req: Request, res: Response) => {
  const connection = await getDBConnection();

  const query = await connection?.execute(
    `select nazov_vysetrenia from is_vysetrenie fetch first 100 rows only`
  );
  var rows = JSON.parse(JSON.stringify(query?.rows));
  res.json(rows);
});

hospitalizationController.get("/getPerformances", async (req: Request, res: Response) => {
  const connection = await getDBConnection();

  const query = await connection?.execute(
    `select nazov_vykonu from is_vykony fetch first 100 rows only`
  );
  var rows = JSON.parse(JSON.stringify(query?.rows));
  res.json(rows);
});

hospitalizationController.get("/getAlergies", async (req: Request, res: Response) => {
  const connection = await getDBConnection();

  const query = await connection?.execute(
    `select nazov_alergie from is_alergie o fetch first 60 rows only`
  );
  var rows = JSON.parse(JSON.stringify(query?.rows));
  res.json(rows);
});



/*hospitalizationRouter.post("/", async (req: Request, res: Response) => {
  const { description, id_employee, id_patient, medicine } = req.body;
  console.log(description, id_employee, id_patient, medicine);

  const connection = await getDBConnection();
  const query = await connection?.execute(
    `insert into is_zaznam (id_zaznam,datum_zaznamu,popis,id_sprava,id_zamestnanec) values ((select max(id_zaznam) + 1 from id_zaznam), '${description}', '${id_patient}', ${id_employee})
     join is_zdravotna_karta usingwhere id_pacient = `
  );
  console.log(query);
  medicine.map((medicament: any) => {
    connection?.execute(
      `insert into is_predpisane_lieky (id_predpisu,id_kod_lieku) values ((select max(id_predpisu) from is_predpis), '${medicament}')`
    );
  });
});*/

export default hospitalizationController;