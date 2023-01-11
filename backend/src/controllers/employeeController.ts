import getDBConnection from "../database";
import express, { Request, Response } from "express";


const employeeServiceRouter = express.Router();


employeeServiceRouter.post("/deleteEmployee", async (req: Request, res: Response) => {
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

employeeServiceRouter.post("/addEmployee", async (req: Request, res: Response) => {
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
  if (queryID?.rows != undefined) {
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

employeeServiceRouter.post("/editEmployee", async (req: Request, res: Response) => {
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

employeeServiceRouter.get(
  "/getEmployees",
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const query = await connection?.execute(
      `select  priezvisko || ' ' || meno || ' ' || titul as cele_meno, id_zamestnanec, nazov from is_zamestnanec join is_osoba using (rod_cislo)
      join is_typ_zamestnancov using (typ_zamestnanca)`
    );

    var data = query?.rows;

    if (data != undefined) {
      var rows = JSON.parse(JSON.stringify(query?.rows));
      res.json(rows);
    }
  }
);




employeeServiceRouter.post(
  "/getBasicInfo",
  async (req: Request, res: Response) => {
    const { id } = req.body;
    const connection = await getDBConnection();

    const query = await connection?.execute(
      `
      select meno,priezvisko,rod_cislo, titul, rodne_priezvisko, ulica, psc, 
      nazov_mesta, id_zamestnanec, nazov as typ, x.informacie.dat_od as dat_od,
      x.informacie.dat_do as dat_do, x.informacie.tel as tel, x.informacie.email as email, id_typu_oddelenia, o.informacie_oddelenia.nazov_oddelenia
      , typ_zdravotnika
      from is_osoba 
      join is_zamestnanec x using (rod_cislo)
      join is_typ_zamestnancov using (typ_zamestnanca)
      join is_oddelenia using (id_zamestnanec)
      join is_typ_oddelenia o using (id_typu_oddelenia)
      join is_mesto using (psc)
      left join is_zdravotnik using (id_zamestnanec)
      where id_zamestnanec = '${id}'
      order by dat_do desc
          `
    );

    var data = query?.rows;

    if (data != undefined) {
      var rows = JSON.parse(JSON.stringify(query?.rows));
      res.json(rows);
    }
  }
);

export default employeeServiceRouter;
