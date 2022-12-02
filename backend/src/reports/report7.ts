import getDBConnection from "../database";
import express, { Request, Response } from "express";

const report7 = express.Router();

report7.get("/", async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const queryResult = await connection?.execute(
    `SELECT ks, pocet, pohlavie, rank() OVER (PARTITION BY pohlavie ORDER BY pocet desc) as rank FROM (SELECT krvna_skupina as ks, pohlavie, count(krvna_skupina) as pocet FROM is_pacient WHERE (to_char(sysdate, 'YYYY') - (19||substr(rod_cislo,1,2)) <= 60) GROUP BY  krvna_skupina, pohlavie)`
  );
  res.json(queryResult?.rows);
});

export default report7;
