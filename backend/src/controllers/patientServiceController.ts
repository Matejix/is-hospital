import getDBConnection from "../database";
import express, { Request, Response } from "express";
import { useMemo } from "react";
import jwt_decode from "jwt-decode";
import jwt from "jsonwebtoken";

const patientServiceRouter = express.Router();

patientServiceRouter.post("/getDepartmentPatients", async (req: Request, res: Response) => {
  const {id} = req.body;
  const connection = await getDBConnection();
  const department = await connection?.execute(
    `select  id_typu_oddelenia from is_oddelenia WHERE id_zamestnanec = ${id}`
  );
  if(department?.rows != null){
      console.log(department.rows);
      var obj = JSON.parse(JSON.stringify(department?.rows));
      var type = obj[0].ID_TYPU_ODDELENIA;

    const query = await connection?.execute(
      `select  priezvisko || ' ' || meno as cele_meno, rod_cislo from is_pacient join is_osoba using (rod_cislo)
      join is_zaznamy using (rod_cislo)
      join is_oddelenia using (id_zamestnanec) 
      where id_typu_oddelenia = ${type}
      group by meno,priezvisko,rod_cislo`
    );
    var rows = JSON.parse(JSON.stringify(query?.rows));
    res.json(rows);
  } else { 
    console.log("Fetching all patients");
    const query = await connection?.execute(
    `select  priezvisko || ' ' || meno as cele_meno, rod_cislo from is_pacient join is_osoba using (rod_cislo)`
    );
    var rows = JSON.parse(JSON.stringify(query?.rows));
    res.json(rows);}
  }
  
);


patientServiceRouter.get("/getPatients", async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const query = await connection?.execute(
      `select  priezvisko || ' ' || meno as cele_meno, rod_cislo from is_pacient join is_osoba using (rod_cislo) fetch first 1000 rows only`
    );
    
  var data = query?.rows
 
  if(data != undefined){
     var rows = JSON.parse(JSON.stringify(query?.rows));
     res.json(rows);}
 
});


patientServiceRouter.post("/getBasicInfo", async (req: Request, res: Response) => {
  const {id} = req.body;
  const connection = await getDBConnection();

  const query = await connection?.execute(
    `select rod_cislo, titul, meno, priezvisko, rodne_priezvisko, ulica, psc, nazov_mesta, f_datum_narodenia(rod_cislo) as datum_narodenia, datum_umrtia, krvna_skupina, zamestnanie, nazov as poistovna from is_pacient
    join is_osoba using (rod_cislo)
    join is_mesto using (psc)
    join is_poistenia using (rod_cislo)
    join is_poistovna using (id_poistovna)
    where dat_do is null and
     rod_cislo = '${id}'`
  );

  var data = query?.rows


 if(data != undefined){
    var rows = JSON.parse(JSON.stringify(query?.rows));
    res.json(rows);}
});


patientServiceRouter.post("/getListOfRecords", async (req: Request, res: Response) => {
  const {id} = req.body;
  const connection = await getDBConnection();

  const query = await connection?.execute(
    `select id_zaznam, datum_zaznamu, (case when id_alergia is not null then 'Alergia' 
    when id_vykon is not null then 'Výkon'  
    when id_sprava is not null then 'Správa'  
    when id_vysetrenie is not null then 'Vyšetrenie'  
    when id_medikacia is not null then 'Medikácia'  
    end) as zaznam,
    (case when id_alergia is not null then  nazov_alergie 
    when id_vykon is not null then nazov_vykonu 
    when id_sprava is not null then  typ_spravy 
    when id_vysetrenie is not null then nazov_vysetrenia
    when id_medikacia is not null then nazov_medikacie 
    end) as typ,
    is_zaznamy.popis, davkovanie_medikacie, diagn.nazov as nazov_diagnozy,
    (titul || ' ' || meno ||  ' ' || priezvisko) as vystavil,
     x.informacie_oddelenia.nazov_oddelenia as oddelenie
      from is_zaznamy 
      left join is_alergie using (id_alergia) 
      left join is_vykony using (id_vykon) 
      left join is_sprava using (id_sprava) 
      left join is_medikacie using (id_medikacia) 
      left join is_vysetrenie using (id_vysetrenie) 
      left join is_diagnoza diagn using (kod_diagnozy)
      left join is_zamestnanec using (id_zamestnanec)
      left join is_oddelenia using (id_zamestnanec)
      left join is_typ_oddelenia x using (id_typu_oddelenia)
      left join is_osoba on (is_zamestnanec.rod_cislo = is_osoba.rod_cislo)
      where is_zaznamy.rod_cislo = '${id}'
      order by datum_zaznamu
`
  );

  var data = query?.rows
 // console.log(data);
  if(data != undefined){
    var rows = JSON.parse(JSON.stringify(query?.rows));
    res.json(rows);}
});


patientServiceRouter.post("/getRequests", async (req: Request, res: Response) => {
  const {id} = req.body;
  const connection = await getDBConnection();

  const query = await connection?.execute(
    `select id_ziadanky, dat_vystavenia, is_ziadanky.popis, diagn.nazov as nazov_diagnozy,
    (zam1.titul || ' ' || zam1.meno ||  ' ' || zam1.priezvisko) as vystavil,
    x.informacie_oddelenia.nazov_oddelenia as oddelenie
from is_ziadanky 
left join is_diagnoza diagn using (kod_diagnozy)
join is_zamestnanec on (is_ziadanky.id_zamestnanec = is_zamestnanec.id_zamestnanec)
join is_osoba zam1 on (is_zamestnanec.rod_cislo = zam1.rod_cislo)
left join is_typ_oddelenia x using (id_typu_oddelenia)
 where is_ziadanky.rod_cislo = '${id}'
 order by dat_vystavenia
`
  );
  var data = query?.rows
  //console.log(data);
  if(data != undefined){
    var rows = JSON.parse(JSON.stringify(query?.rows));
    res.json(rows);}
});

patientServiceRouter.post("/getPrescriptions", async (req: Request, res: Response) => {
  const {id} = req.body;
  const connection = await getDBConnection();
  //console.log(req.body);

  const query = await connection?.execute(
    `select id_predpisu || id_kod_lieku as kod, popis,
    (zam1.titul || ' ' || zam1.meno ||  ' ' || zam1.priezvisko) as vystavil, 
    x.liek.nazov as liek
     from is_predpis 
    join is_predpisane_lieky using (id_predpisu)
     join is_lieky x using (id_kod_lieku)
    
    join is_zamestnanec on (is_predpis.id_zamestnanec = is_zamestnanec.id_zamestnanec)
    join is_osoba zam1 on (is_zamestnanec.rod_cislo = zam1.rod_cislo)
 where is_predpis.rod_cislo = '${id}'
`
  );
  var data = query?.rows
 // console.log(data);
  if(data != undefined){
  var rows = JSON.parse(JSON.stringify(query?.rows));
  res.json(rows);}
});

export default patientServiceRouter;
