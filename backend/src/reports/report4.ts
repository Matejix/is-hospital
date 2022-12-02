import getDBConnection from "../database";
import express, { Request, Response } from "express";

const report4 = express.Router();

report4.get("/", async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const queryResult = await connection?.execute(
    `select nazov, pocet from ( select nazov, pocet, rank() over (partition by nazov order by pocet) as poradie from (select ip.nazov as nazov, count (ips.rod_cislo) as pocet from is_poistovna ip join is_poistenia ips on (ip.id_poistovna = ips.id_poistovna) where dat_do is null group by ip.nazov))
    `
  );
  res.json(queryResult?.rows);
});

export default report4;
