import getDBConnection from "../database";
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";

const registerRouter = express.Router();

registerRouter.post("/", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const connection = await getDBConnection();
  const queryEmployeeIDExists = await connection?.execute(
    `select * from is_zamestnanec_login WHERE login = '${username}'`
  );
  var obj = JSON.parse(JSON.stringify(queryEmployeeIDExists?.rows));


  if ( queryEmployeeIDExists?.rows?.length == 1  ) {
    var passwordFromDb = obj[0].HESLO;
    if( passwordFromDb == null){ var hashedPasw = await bcrypt.hash(password, 10);
      await connection?.execute(
        `update is_zamestnanec_login set heslo = '${hashedPasw}' where login = '${username}'`
      );
      await connection?.commit().then(() => {
        res.status(200).json({ message: "Registration was successful!" });
    });
    console.log(res.status);}
    //if id of employee is in db and is not registered
   
  } else {
    res.status(400).json({ message: "Registration was unsuccessful!" });
  }
});

export default registerRouter;
