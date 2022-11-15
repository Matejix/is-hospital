import getDBConnection from "../database";
import express, { Request, Response } from 'express';
import OracleDB, { autoCommit } from "oracledb";
const router  = express.Router(); 


router.post("/", async (req: Request, res: Response) => {
  const { username, password} = req.body;
  const connection = await getDBConnection();

  const queryEmployeeRegistered = await connection?.execute(
    `select * from is_zamestnanec_login WHERE id_zamestnanec = ${username}`
  );

  if(queryEmployeeRegistered?.rows?.length == 1){ //if id of employee exist

    const passwordQuery = await connection?.execute(
        `select heslo from is_zamestnanec_login WHERE id_zamestnanec = ${username}`, [], {outFormat: OracleDB.OUT_FORMAT_OBJECT});

    var obj1 = JSON.parse(JSON.stringify(passwordQuery?.rows));
    var passwordFromDb = obj1[0].HESLO;

    if(passwordFromDb == password){
        res.json("Login Succesfull");
        console.log("User " + username + " logged in");
    }
  } else {
      res.json("Login unsuccessful");
      res.status(400);
  }
});
  
module.exports = router;

