import getDBConnection from "../database";
import express, { Request, Response } from "express";

const report1 = express.Router();

report1.get("/", async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const queryResult = await connection?.execute(
    `select count(id_vysetrenie) as pocet_vysetreni, count(id_vykon) as pocet_vykonov,count(id_medikacia) as pocet_medikacii, to_char(datum_zaznamu,'Q') as kvartal from is_zaznamy where to_char(datum_zaznamu,'YYYY') = to_char(sysdate,'YYYY') group by to_char(datum_zaznamu,'Q') order by kvartal`
  );
  res.json(queryResult?.rows);
});

export default report1;
