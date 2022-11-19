import getDBConnection from "../database";
import express, { Request, Response } from "express";
const patientServiceRouter = express.Router();

patientServiceRouter.get("/getPatients", async (req: Request, res: Response) => {
    const connection = await getDBConnection();

    const query = await connection?.execute(
      `select meno, priezvisko from is_osoba `
    );
    var rows = JSON.parse(JSON.stringify(query?.rows));
    console.log(rows);
    res.json(rows);
});

export default patientServiceRouter;
