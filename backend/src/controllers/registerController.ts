import getDBConnection from "../database";
import express, { Request, Response } from "express";

const registerRouter = express.Router();

registerRouter.post("/", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const connection = await getDBConnection();
  const queryEmployeeIDExists = await connection?.execute(
    `select * from is_zamestnanec_login WHERE login = '${username}'`
  );
  var obj = JSON.parse(JSON.stringify(queryEmployeeIDExists?.rows));
  var passwordFromDb = obj[0].HESLO;

  console.log(obj);

  if (
    queryEmployeeIDExists?.rows?.length == 1 &&
    passwordFromDb == null
  ) {
    //if id of employee is in db and is not registered
    await connection?.execute(
      `update is_zamestnanec_login set heslo = '${password}' where login = '${username}'`
    );
    await connection?.commit();
  } else {
    res.json("Registration was unsuccesfull!");
  }
});

export default registerRouter;
