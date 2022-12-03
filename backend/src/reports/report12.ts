import getDBConnection from "../database";
import express, { Request, Response } from "express";

interface Row {
  ZIADANKY: string;
}

const report12 = express.Router();

report12.get("/", async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const queryResult1 = await connection?.execute(
    `select json_object('oddelenia' value  ito.informacie_oddelenia.nazov_oddelenia || ' - ' || ito.informacie_oddelenia.popis_oddelenia  , 
    'pacienti' value json_arrayagg(to_char(dat_vystavenia,'DD.MM.YYYY') || ' - ' || meno || ' ' || priezvisko)) as ziadanky
    from is_typ_oddelenia ito
    join is_ziadanky using (id_typu_oddelenia)
    join is_osoba using (rod_cislo)
    join is_pacient using (rod_cislo)
    where to_char(dat_vystavenia,'YYYY') = to_char(sysdate,'YYYY')-1
    group by ito.informacie_oddelenia.nazov_oddelenia,
    ito.informacie_oddelenia.popis_oddelenia`
  );
  const data = (queryResult1?.rows as Row[])?.map((row) => ({
    ZIADANKY: JSON.parse(row.ZIADANKY),
  }));
  res.json(data);
});

export default report12;
