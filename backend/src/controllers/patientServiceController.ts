import getDBConnection from "../database";
import express, { Request, Response } from "express";
const patientServiceRouter = express.Router();

patientServiceRouter.get("/getPatients", async (req: Request, res: Response) => {
    const connection = await getDBConnection();

    const query = await connection?.execute(
      `select meno, priezvisko, rod_cislo from is_pacient join is_osoba using (rod_cislo)`
    );
    var rows = JSON.parse(JSON.stringify(query?.rows));
    res.json(rows);
});

export default patientServiceRouter;
