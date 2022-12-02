import getDBConnection from "../database";
import express, { Request, Response } from "express";
import convert from 'xml-js';
import fs from 'fs';

import OracleDB from "oracledb";
const report6 = express.Router();
interface Row {
  PACIENTI: string;
}

report6.get("/", async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const queryResult = await connection?.execute(
`
select json_object('pacient' value meno || ' ' || priezvisko || ' ' || rod_cislo, 
    'zaznamy' value json_arrayagg(to_char(datum_zaznamu,'DD.MM.YYYY')  || ' ' ||  case when id_alergia is not null then 'Alergia: ' || nazov_alergie end || 
    case when id_sprava is not null then 'Lekárska správa: ' || typ_spravy end || 
    case when id_vykon is not null then 'Výkon: ' || nazov_vykonu end || 
    case when id_vysetrenie is not null then 'Vyšetrenie: ' || nazov_vysetrenia end || 
    case when id_medikacia is not null then 'Medikácia: ' || nazov_medikacie end
    )) as PACIENTI
from is_pacient 
join is_zaznamy using(rod_cislo) 
join is_osoba using(rod_cislo) 
left join is_alergie using (id_alergia)
left join is_sprava using (id_sprava)
left join is_vysetrenie using (id_vysetrenie)
left join is_vykony using (id_vykon)
left join is_medikacie using (id_medikacia)
where rod_cislo in ('690602/2180', '960806/7744', '915409/2884')
group by meno, priezvisko,rod_cislo
`
  );

  const data = (queryResult?.rows as Row[])?.map((row) => ({
    
    PACIENTI: JSON.parse(row.PACIENTI),
  }
  ));
  
  res.json(data);
});

export default report6;
