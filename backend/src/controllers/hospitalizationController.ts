import getDBConnection from "../database";
import express, { Request, Response } from "express";
const hospitalizationRouter = express.Router();

hospitalizationRouter.get(
  "/getPatients",
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();

    const query = await connection?.execute(
      `select meno, priezvisko, rod_cislo from is_pacient join is_osoba using (rod_cislo) fetch first 1000 rows only`
    );
    var rows = JSON.parse(JSON.stringify(query?.rows));
    res.json(rows);
  }
);

hospitalizationRouter.get(
  "/getDepartments",
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();

    const query = await connection?.execute(
      `select o.informacie_oddelenia.nazov_oddelenia as "NAZOV", o.informacie_oddelenia.popis_oddelenia as "POPIS" 
     from is_typ_oddelenia o fetch first 1000 rows only`
    );
    var rows = JSON.parse(JSON.stringify(query?.rows));
    res.json(rows);
  }
);

hospitalizationRouter.get(
  "/getReportTypes",
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();

    const query = await connection?.execute(
      `select id_sprava, typ_spravy from is_sprava o fetch first 15 rows only`
    );
    var rows = JSON.parse(JSON.stringify(query?.rows));
    res.json(rows);
  }
);

hospitalizationRouter.get(
  "/getDiagnoses",
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();

    const query = await connection?.execute(
      `select kod_diagnozy, nazov from is_diagnoza fetch first 100 rows only`
    );
    var rows = JSON.parse(JSON.stringify(query?.rows));
    res.json(rows);
  }
);

hospitalizationRouter.get(
  "/getCheckups",
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();

    const query = await connection?.execute(
      `select id_vysetrenie, nazov_vysetrenia from is_vysetrenie fetch first 100 rows only`
    );
    var rows = JSON.parse(JSON.stringify(query?.rows));
    res.json(rows);
  }
);

hospitalizationRouter.get(
  "/getPerformances",
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();

    const query = await connection?.execute(
      `select  nazov_vykonu from is_vykony fetch first 100 rows only`
    );
    var rows = JSON.parse(JSON.stringify(query?.rows));
    res.json(rows);
  }
);

hospitalizationRouter.get(
  "/getAlergies",
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();

    const query = await connection?.execute(
      `select id_alergia, nazov_alergie from is_alergie o fetch first 60 rows only`
    );
    var rows = JSON.parse(JSON.stringify(query?.rows));
    res.json(rows);
  }
);

hospitalizationRouter.post(
  "/postReport",
  async (req: Request, res: Response) => {
    const { description, id_employee, id_patient, date, reportType } = req.body;
    console.log(description, id_employee, id_patient, date, reportType);

    const connection = await getDBConnection();
    const query = await connection?.execute(
      `insert into is_zaznamy (id_zaznam,datum_zaznamu,popis,rod_cislo,id_zamestnanec, id_sprava) values ((select max(id_zaznam) + 1 from is_zaznamy), 
    to_date('${date}','DD.MM.YYYY'), '${description}', '${id_patient}', ${id_employee}, '${reportType}')`
    );
    console.log(query);
  }
);

hospitalizationRouter.post(
  "/postAlergy",
  async (req: Request, res: Response) => {
    const { description, id_employee, id_patient, date, alergy } = req.body;
    console.log(description, id_employee, id_patient, date, alergy);

    const connection = await getDBConnection();
    const query = await connection?.execute(
      `insert into is_zaznamy (id_zaznam,datum_zaznamu,popis,rod_cislo,id_zamestnanec, id_alergia) values ((select max(id_zaznam) + 1 from is_zaznamy),
    to_date('${date}','DD.MM.YYYY'), '${description}', '${id_patient}', ${id_employee}, '${alergy}')`
    );

    res.status(200).json({ message: "Success" });
  }
);

hospitalizationRouter.post(
  "/postCheckup",
  async (req: Request, res: Response) => {
    const { description, id_employee, id_patient, date, checkup } = req.body;
    console.log(description, id_employee, id_patient, date, checkup);

    const connection = await getDBConnection();
    const query = await connection?.execute(
      `insert into is_zaznamy (id_zaznam,datum_zaznamu,popis,rod_cislo,id_zamestnanec, id_vysetrenie) values ((select max(id_zaznam) + 1 from is_zaznamy),
    to_date('${date}','DD.MM.YYYY'), '${description}', '${id_patient}', ${id_employee}, '${checkup}')`
    );
    res.status(200).json({ message: "Success" });
  }
);

hospitalizationRouter.post(
  "/postDiagnosis",
  async (req: Request, res: Response) => {
    const { description, id_employee, id_patient, date, diagnose } = req.body;
    console.log(description, id_employee, id_patient, date, diagnose);

    const connection = await getDBConnection();
    const query = await connection?.execute(
      `insert into is_zaznamy (id_zaznam,datum_zaznamu,popis,rod_cislo,id_zamestnanec, kod_diagnozy) values ((select max(id_zaznam) + 1 from is_zaznamy),
    to_date('${date}','DD.MM.YYYY'), '${description}', '${id_patient}', ${id_employee},'${diagnose}')`
    );
    res.status(200).json({ message: "Success" });
  }
);

export default hospitalizationRouter;
