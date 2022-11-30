import getDBConnection from "../database";
import express, { Request, Response } from "express";

const report5 = express.Router();

report5.get("/", async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const queryResult = await connection?.execute(
    `select kod, nazov, pocet from (SELECT id_kod_lieku kod, l.liek.nazov nazov, count(*) pocet, row_number() over(order by count(*) desc) as poradie from is_lieky l
    join is_predpisane_lieky using (id_kod_lieku)
    group by id_kod_lieku, l.liek.nazov) 
    where poradie <= 25`
  );
  res.json(queryResult?.rows);
});

export default report5;
