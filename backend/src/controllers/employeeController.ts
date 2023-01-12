import getDBConnection from "../database";
import express, { Request, Response } from "express";


const employeeServiceRouter = express.Router();




employeeServiceRouter.post("/addEmployee", async (req: Request, res: Response) => {
  const { id, name, surname, birthsurname, street, city, employmentStart, employmentEnd, title,
    typesOfEmployee,    typesOfDepartment,  typesOfMedic, tel, email} = req.body;
  console.log(req.body);
  const connection = await getDBConnection();
  const queryID = await connection?.execute(
    `select rod_cislo from is_osoba where rod_cislo = '${id}'`
  );
  const queryNewEmployeeID = await connection?.execute(
    `select max(id_zamestnanec) as id from is_zamestnanec`
  );
  if (queryID?.rows != undefined && queryID?.rows.length == 0) {
    console.log("here");

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
  } 

  const queryEmployeeID = await connection?.execute(
    `select rod_cislo from is_zamestnanec where rod_cislo = '${id}'`
  );
  if (queryEmployeeID?.rows != undefined && queryEmployeeID?.rows.length == 0) {
    console.log("here");
    var obj = JSON.parse(JSON.stringify(queryNewEmployeeID?.rows));
    var employeeId = obj[0].ID + 1;
    console.log(employeeId);
    console.log(typesOfDepartment);

    const queryEmployee = await connection?.execute(
      `insert into is_zamestnanec (rod_cislo, typ_zamestnanca,id_zamestnanec, informacie) values (
    '${id}','${typesOfEmployee}','${employeeId}', 
    '{ dat_od:"${employmentStart}", dat_do:"${employmentEnd}", tel:"${tel}", email:"${email}"}')`
    );
    await connection?.commit();

     
    if(typesOfMedic != 0){
      console.log("hereeeeee");

      const queryEmployeeDepartment = await connection?.execute(
      `insert into is_zdravotnik (id_zamestnanec, typ_zdravotnika) values (
        ${employeeId},'${typesOfMedic}')`
        );
        await connection?.commit();
    }

    if(typesOfDepartment != ''){
      console.log("id " + employeeId);

      const queryEmployeeDepartment = await connection?.execute(
      `insert into is_oddelenia (id_zamestnanec, id_typu_oddelenia) values ( ${employeeId} , ${typesOfDepartment} )`);
        await connection?.commit();
    }
   
    
    

    await connection?.commit().then(() => {
      res.status(200).json({ message: "Zamestnanec s id" + queryEmployeeID+ " pridaný" });
    });
  } else {
    return res.status(400).json({ message: "Užívateľ s daným rodným číslom už existuje!" });
  }
});

employeeServiceRouter.post("/editEmployee", async (req: Request, res: Response) => {
 const { employeeId, id, name, surname, birthsurname, street, city, employmentStart, employmentEnd, title,
    typesOfEmployee,    typesOfDepartment,  typesOfMedic, tel, email} = req.body;  console.log(req.body);
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
  const queryEmployee = await connection?.execute(
    `update is_zamestnanec set
     informacie =  '{ dat_od:"${employmentStart}", dat_do:"${employmentEnd}", tel:"${tel}", email:"${email}"}'
     where id_zamestnanec = '${employeeId}'`
  );
  await connection?.commit();

  if(typesOfMedic != 0){
    const queryEmployee = await connection?.execute(
      `update is_zdravotnik set
       typ_zdravotnika =  '${typesOfMedic}'
       where id_zamestnanec = '${employeeId}'`
    );
    await connection?.commit();
  }

  if(typesOfMedic != 0){
    const queryEmployee = await connection?.execute(
      `update is_zdravotnik set
       typ_zdravotnika =  '${typesOfMedic}'
       where id_zamestnanec = '${employeeId}'`
    );
    await connection?.commit();
  }

  if(typesOfMedic != 0){
    const queryEmployee = await connection?.execute(
      `update is_oddelenia set
       id_typu_oddelenia =  '${typesOfDepartment}'
       where id_zamestnanec = '${employeeId}'`
    );
    await connection?.commit();
  }

  await connection?.commit();

  res.status(200).json({ message: "Dáta úspešne zmenené" });

});

employeeServiceRouter.get(
  "/getEmployees",
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const query = await connection?.execute(
      `select  priezvisko || ' ' || meno || ' ' || titul as cele_meno, id_zamestnanec, nazov from is_zamestnanec join is_osoba using (rod_cislo)
      join is_typ_zamestnancov using (typ_zamestnanca)
      order by id_zamestnanec`
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
      nazov_mesta, id_zamestnanec, typ_zamestnanca, nazov as typ, x.informacie.dat_od as dat_od,
      x.informacie.dat_do as dat_do, x.informacie.tel as tel, x.informacie.email as email,
       id_typu_oddelenia, o.informacie_oddelenia.nazov_oddelenia as nazov_oddelenia
      , typ_zdravotnika
      from is_osoba 
      join is_zamestnanec x using (rod_cislo)
      join is_typ_zamestnancov using (typ_zamestnanca)
      left join is_oddelenia using (id_zamestnanec)
      left join is_typ_oddelenia o using (id_typu_oddelenia)
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

employeeServiceRouter.get(
  "/getTypesOfEmployees",
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const query = await connection?.execute(
      `select  * from is_typ_zamestnancov`
    );
    var data = query?.rows;
    if (data != undefined) {
      var rows = JSON.parse(JSON.stringify(query?.rows));
      res.json(rows);
    }
  }
);


employeeServiceRouter.get(
  "/getTypesOfMedics",
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const query = await connection?.execute(
      `select typ_zdravotnika from is_zdravotnik
      group by typ_zdravotnika`
    );
    var data = query?.rows;
    if (data != undefined) {
      var rows = JSON.parse(JSON.stringify(query?.rows));
      res.json(rows);
    }
  }
);

employeeServiceRouter.get(
  "/getTypesOfDepartments",
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const query = await connection?.execute(
      `select id_typu_oddelenia, x.informacie_oddelenia.nazov_oddelenia as nazov_oddelenia
       from is_typ_oddelenia x`
    );
    var data = query?.rows;
    if (data != undefined) {
      var rows = JSON.parse(JSON.stringify(query?.rows));
      res.json(rows);
    }
  }
);



export default employeeServiceRouter;
