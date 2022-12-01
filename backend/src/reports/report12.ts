import getDBConnection from "../database";
import express, { Request, Response } from "express";

interface Row {
  ODDELENIA: string;
}

const report12 = express.Router();

report12.get("/", async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const queryResult1 = await connection?.execute(
    `select json_object('nazov_oddelenia' value ito.informacie_oddelenia.nazov_oddelenia,'doktori' value json_arrayagg(iso.titul || ' ' ||iso.meno || ' ' || iso.priezvisko)) as oddelenia from is_typ_oddelenia ito left join is_oddelenia io on(io.id_typu_oddelenia = ito.id_typu_oddelenia) left join is_zdravotnik iz on(io.id_zamestnanec = iz.id_zamestnanec) left join is_zamestnanec iza on(iza.id_zamestnanec = iz.id_zamestnanec) left join is_osoba iso on(iso.rod_cislo = iza.rod_cislo) where ito.informacie_oddelenia.lozkova_cast like 'A' group by ito.informacie_oddelenia.nazov_oddelenia`
  );
  const data = (queryResult1?.rows as Row[])?.map((row) => ({
    ODDELENIA: JSON.parse(row.ODDELENIA),
  }));
  res.json(data);
});

export default report12;
