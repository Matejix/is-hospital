import getDBConnection from "../database";
import express, { Request, Response } from "express";


const patientServiceRouter = express.Router();

interface Row {
  PREDPISY: string;
}

patientServiceRouter.post(
  "/getDepartmentPatients",
  async (req: Request, res: Response) => {
    const { id } = req.body;
    const connection = await getDBConnection();
    const department = await connection?.execute(
      `select  id_typu_oddelenia from is_oddelenia WHERE id_zamestnanec = ${id}`
    );
    if (department?.rows != null) {
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
      res.json(rows);
    }
  }
);

patientServiceRouter.post("/deletePatient", async (req: Request, res: Response) => {
  const { id } = req.body;
  console.log(id);
  const connection = await getDBConnection();
  const query1 = await connection?.execute(
    `delete from is_vykon where id_zaznam in (select id_zaznam from is_zaznamy where rod_cislo = '${id}')`
  );
  await connection?.commit();
  const query2 = await connection?.execute(
    `delete from is_zdravotna_karta where rod_cislo = '${id}'`
  );
  await connection?.commit();
  const query3 = await connection?.execute(
    `delete from is_zaznamy where rod_cislo = '${id}'`
  );
  await connection?.commit();
  const query4 = await connection?.execute(
    `delete from is_ziadanky where rod_cislo = '${id}'`
  );
  await connection?.commit();
  const query5 = await connection?.execute(
    `delete from is_predpisane_lieky where id_predpisu in (select id_predpisu from is_predpis where rod_cislo = '${id}')`
  );
  await connection?.commit();
  const query6 = await connection?.execute(
    `delete from is_predpis where rod_cislo = '${id}'`
  );
  await connection?.commit();
  const query7 = await connection?.execute(
    `delete from is_poistenia where rod_cislo = '${id}'`
  );
  await connection?.commit();
  const query = await connection?.execute(
    `delete from is_pacient where rod_cislo = '${id}'`
  );
  await connection?.commit().then(() => {
    res.status(200).json({ message: "Success" });
  });
});

patientServiceRouter.post("/addPatient", async (req: Request, res: Response) => {
  const { name, surname, birthsurname, id, birthdate, deathdate, bloodtype, employment, street, city, insurance, insuranceStart, insuranceEnd, title } = req.body;
  console.log(req.body);
  const connection = await getDBConnection();
  var sex = parseInt(id.toString().substring(2, 4)) > 12 ? 'Z' : 'M';
  console.log(sex);
  const queryID = await connection?.execute(
    `select rod_cislo from is_osoba where rod_cislo = '${id}'`
  );
  const queryInsuranceID = await connection?.execute(
    `select max(id_poistenia) as id from is_poistenia`
  );
  if (queryID?.rows != undefined && queryID?.rows.length == 0) {
    const queryPerson = await connection?.execute(
      `insert into is_osoba (rod_cislo, meno, priezvisko, ulica, psc) values (
    '${id}','${name}','${surname}','${street}','${city}')`
    );
    await connection?.commit();
    if (title != '') {
      const query = await connection?.execute(
        `update is_osoba set titul = '${title}'
        where rod_cislo = '${id}'`
      );
      await connection?.commit();
    }
    if (birthsurname != '') {
      const query = await connection?.execute(
        `update is_osoba set rodne_priezvisko = '${birthsurname}'
        where rod_cislo = '${id}'`
      );
      await connection?.commit();
    }

    const queryPatient = await connection?.execute(
      `insert into is_pacient (rod_cislo, pohlavie,krvna_skupina) values (
    '${id}','${sex}','${bloodtype}')`
    );
    await connection?.commit();

    if (deathdate != '') {
      const query = await connection?.execute(
        `update is_pacient set datum_umrtia = to_date('${birthdate}', 'DD.MM.YYYY')
         where rod_cislo = '${id}'`
      );
      await connection?.commit();
    }

    if (employment != '') {
      const query = await connection?.execute(
        `update is_pacient set zamestnanie = '${employment}'
        where rod_cislo = '${id}'`
      );
      await connection?.commit();
    }
    var obj = JSON.parse(JSON.stringify(queryInsuranceID?.rows));
    var insuranceID = obj[0].ID + 1;
    const queryInsurance = await connection?.execute(
      `insert into is_poistenia (id_poistenia, rod_cislo, id_poistovna, dat_od) values
      (${insuranceID}, '${id}',${insurance},to_date('${insuranceStart}', 'DD.MM.YYYY'))`
    );
    await connection?.commit();
    if (insuranceEnd != '') {
      const query = await connection?.execute(
        `update is_poistenia set dat_do = to_date('${insuranceEnd}', 'DD.MM.YYYY')
         where rod_cislo = '${id}'`
      );
      await connection?.commit();
    }

    await connection?.commit().then(() => {
      res.status(200).json({ message: "Success" });
    });
  } else {
    return res.status(400).json({ message: "Užívateľ s daným rodným číslom už existuje!" });
  }
});

patientServiceRouter.post("/editPatient", async (req: Request, res: Response) => {
  const { id, name, surname, birthsurname, deathdate, bloodtype, employment, street, city, insurance, insuranceStart, insuranceEnd, title, insuranceId } = req.body;
  console.log(req.body);
  const connection = await getDBConnection();


  const queryPerson = await connection?.execute(
    `update is_osoba set titul = '${title}',
     meno = '${name}',
     priezvisko = '${surname}',
     rodne_priezvisko  = '${birthsurname}',
     ulica = '${street}',
     psc  = '${city}'
      where rod_cislo = '${id}'`
  );
  await connection?.commit();
  if (deathdate != '' ) {
    const queryPatient = await connection?.execute(
      `update is_pacient set zamestnanie = '${employment}',
       krvna_skupina = '${bloodtype}',
       datum_umrtia = to_date('${deathdate}', 'DD.MM.YYYY')
      where rod_cislo = '${id}'`
    );
    await connection?.commit();
  } else {
    const queryPatient = await connection?.execute(
      `update is_pacient set zamestnanie = '${employment}',
       krvna_skupina = '${bloodtype}'
       where rod_cislo = '${id}'`
    );
    await connection?.commit();
  }
  if (insurance != '') {

    const queryInsuranceID = await connection?.execute(
      `select max(id_poistenia) as id from is_poistenia`
    );
    var obj = JSON.parse(JSON.stringify(queryInsuranceID?.rows));
    var insuranceID = obj[0].ID + 1;
    if (insuranceEnd != '') {
      const queryInsurance = await connection?.execute(
        `insert into is_poistenia (id_poistenia, rod_cislo, id_poistovna, dat_od, dat_do) values
       (${insuranceID}, '${id}',${insurance},to_date('${insuranceStart}', 'DD.MM.YYYY'), to_date('${insuranceEnd}', 'DD.MM.YYYY'))`
      );
      await connection?.commit();
    } else {
      const queryInsurance = await connection?.execute(
        `insert into is_poistenia (id_poistenia, rod_cislo, id_poistovna, dat_od) values
         (${insuranceID}, '${id}',${insurance},to_date('${insuranceStart}', 'DD.MM.YYYY'))`
      );
      await connection?.commit();
    }
  }

  if (insurance == '' && insuranceEnd != '') {
    const queryInsurance = await connection?.execute(
      `update is_poistenia set dat_do = to_date('${insuranceEnd}', 'DD.MM.YYYY') 
        where id_poistenia = '${insuranceId}'`
    );
    await connection?.commit();
  }

  res.status(200).json({ message: "Dáta úspešne zmenené" });

});

patientServiceRouter.get(
  "/getPatients",
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const query = await connection?.execute(
      `select  priezvisko || ' ' || meno as cele_meno, rod_cislo from is_pacient join is_osoba using (rod_cislo) fetch first 1000 rows only`
    );

    var data = query?.rows;

    if (data != undefined) {
      var rows = JSON.parse(JSON.stringify(query?.rows));
      res.json(rows);
    }
  }
);

patientServiceRouter.get(
  "/getBloodTypes",
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const query = await connection?.execute(
      `select  krvna_skupina from is_pacient
      group by krvna_skupina`
    );

    var data = query?.rows;

    if (data != undefined) {
      var rows = JSON.parse(JSON.stringify(query?.rows));
      res.json(rows);
    }
  }
);


patientServiceRouter.get(
  "/getInsurances",
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const query = await connection?.execute(
      `select  id_poistovna, nazov from is_poistovna`
    );

    var data = query?.rows;

    if (data != undefined) {
      var rows = JSON.parse(JSON.stringify(query?.rows));
      res.json(rows);
    }
  }
);

patientServiceRouter.get(
  "/getCities",
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const query = await connection?.execute(
      `select  psc, nazov_mesta from is_mesto
      order by nazov_mesta`
    );

    var data = query?.rows;

    if (data != undefined) {
      var rows = JSON.parse(JSON.stringify(query?.rows));
      res.json(rows);
    }
  }
);

patientServiceRouter.post(
  "/getBasicInfo",
  async (req: Request, res: Response) => {
    const { id } = req.body;
    const connection = await getDBConnection();

    const query = await connection?.execute(
      `
      select rod_cislo, titul, meno, priezvisko, rodne_priezvisko, ulica, psc, nazov_mesta, datum_narodenia,
             datum_umrtia, krvna_skupina, zamestnanie, poistovna, id_poistovna, dat_od, dat_do, id_poistenia from (
      select rod_cislo, titul, meno, priezvisko, rodne_priezvisko, ulica, psc, nazov_mesta, f_datum_narodenia(rod_cislo) as datum_narodenia,
             datum_umrtia, krvna_skupina, zamestnanie, nazov as poistovna, id_poistovna, dat_od, dat_do, id_poistenia, row_number() over (partition by rod_cislo order by dat_od desc ) rn from is_pacient
          join is_osoba using (rod_cislo)
          join is_mesto using (psc)
          join is_poistenia using (rod_cislo)
          join is_poistovna using (id_poistovna)
          where rod_cislo = '${id}')
          where rn = 1`
    );

    var data = query?.rows;

    if (data != undefined) {
      var rows = JSON.parse(JSON.stringify(query?.rows));
      res.json(rows);
    }
  }
);

patientServiceRouter.post(
  "/getListOfRecords",
  async (req: Request, res: Response) => {
    const { id } = req.body;
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

    var data = query?.rows;
    // console.log(data);
    if (data != undefined) {
      var rows = JSON.parse(JSON.stringify(query?.rows));
      res.json(rows);
    }
  }
);

patientServiceRouter.post(
  "/getRequests",
  async (req: Request, res: Response) => {
    const { id } = req.body;
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
    var data = query?.rows;
    //console.log(data);
    if (data != undefined) {
      var rows = JSON.parse(JSON.stringify(query?.rows));
      res.json(rows);
    }
  }
);

patientServiceRouter.post(
  "/getPrescriptions",
  async (req: Request, res: Response) => {
    const { id } = req.body;
    const connection = await getDBConnection();
    //console.log(req.body);

    // const query = await connection?.execute(
    //   `select id_predpisu || id_kod_lieku as kod, popis,
    //     (zam1.titul || ' ' || zam1.meno ||  ' ' || zam1.priezvisko) as vystavil,
    //     x.liek.nazov as liek
    //      from is_predpis
    //     join is_predpisane_lieky using (id_predpisu)
    //      join is_lieky x using (id_kod_lieku)

    //     join is_zamestnanec on (is_predpis.id_zamestnanec = is_zamestnanec.id_zamestnanec)
    //     join is_osoba zam1 on (is_zamestnanec.rod_cislo = zam1.rod_cislo)
    //  where is_predpis.rod_cislo = '${id}'
    // `
    // );

    const query = await connection?.execute(
      `select json_object('kod' value id_predpisu, 'vystavil' value zam1.titul || ' ' || zam1.meno || ' ' || zam1.priezvisko,'popis' value popis,'liek' value json_arrayagg(x.liek.nazov)) as predpisy from is_predpis join is_predpisane_lieky using (id_predpisu) join is_lieky x using(id_kod_lieku) join is_zamestnanec on (is_predpis.id_zamestnanec = is_zamestnanec.id_zamestnanec) join is_osoba zam1 on (is_zamestnanec.rod_cislo = zam1.rod_cislo) where is_predpis.rod_cislo = '${id}' group by id_predpisu,popis,zam1.titul, zam1.meno, zam1.priezvisko`
    );

    var data = query?.rows;
    //console.log(query?.rows);
    if (data != undefined) {
      const datas = (query?.rows as Row[])?.map((row) => ({
        PREDPISY: JSON.parse(row.PREDPISY),
      }));
      //var rows = JSON.parse(query?.rows);
      //console.log(datas);
      res.json(datas);
    }
  }
);

export default patientServiceRouter;
