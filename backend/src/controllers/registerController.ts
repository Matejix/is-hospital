import getDBConnection from "../database";
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";

const registerRouter = express.Router();

registerRouter.post("/", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const connection = await getDBConnection();
  const queryEmployeeIDExists = await connection?.execute(
    `select * from is_zamestnanec WHERE id_zamestnanec = ${username}`
  );
  const queryEmployeeRegistered = await connection?.execute(
    `select * from is_zamestnanec_login WHERE id_zamestnanec = ${username}`
  );

  if (
    queryEmployeeIDExists?.rows?.length == 1 &&
    queryEmployeeRegistered?.rows?.length == 0
  ) {
    //if id of employee is in db and is not registered
    var hashedPasw = await bcrypt.hash(password, 10);
    await connection?.execute(
      `insert into is_zamestnanec_login (heslo,id_zamestnanec) values ('${hashedPasw}',${username})`
    );
    await connection?.commit().then(() => {
      res.status(200).json({ message: "Registration was successful!" });
    });
    console.log(res.status);
  } else {
    res.status(400).json({ message: "Registration was unsuccessful!" });
  }
});

export default registerRouter;
