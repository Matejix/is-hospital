import getDBConnection from "../database";
import express, { Request, Response } from 'express';
import { autoCommit } from "oracledb";
const router  = express.Router(); 


router.post("/", async (req: Request, res: Response) => {
  const { username, password} = req.body;
  
  const connection = await getDBConnection();
  const queryEmployeeIDExists = await connection?.execute(
    `select * from is_zamestnanec WHERE id_zamestnanec = ${username}`
  );
  const queryEmployeeRegistered = await connection?.execute(
    `select * from is_zamestnanec_login WHERE id_zamestnanec = ${username}`
  );

  if(queryEmployeeIDExists?.rows?.length == 1 
    && queryEmployeeRegistered?.rows?.length == 0){ //if id of employee is in db and is not registered
    const queryResult = await connection?.execute(
        `insert into is_zamestnanec_login (heslo,id_zamestnanec) values ('${password}',${username})`);
    await connection?.commit();
  } else {
      res.json("Registration was unsuccesfull!");
  }
});
  
module.exports = router;

