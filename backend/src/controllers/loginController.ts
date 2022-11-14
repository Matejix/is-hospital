import getDBConnection from "../database";
import express, { Request, Response } from 'express';
import OracleDB, { autoCommit } from "oracledb";
import { stringify } from "querystring";
const router  = express.Router(); 


router.post("/", async (req: Request, res: Response) => {
  const { username, password} = req.body;
  console.log(req.body);
  const connection = await getDBConnection();

  const queryEmployeeRegistered = await connection?.execute(
    `select * from is_zamestnanec_login WHERE id_zamestnanec = ${username}`
  );

  if(queryEmployeeRegistered?.rows?.length == 1){ //if id of employee exist

    const passwordQuery = await connection?.execute(
        `select heslo from is_zamestnanec_login WHERE id_zamestnanec = ${username}`);    
        const passwordFromDb = passwordQuery?.rows?.toString();
        passwordFromDb?.slice(6);
        if(passwordFromDb == password){
            res.json("Login Succesfull");
        }
  } else {
      res.json("Login unsuccessful");
      res.status(400);
  }
});
  
module.exports = router;

