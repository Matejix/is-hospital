import getDBConnection from "../database";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import validateToken from "./validateToken";
import bcrypt from "bcrypt";

const loginRouter = express.Router();

loginRouter.post("/", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const connection = await getDBConnection();

  const queryEmployeeRegistered = await connection?.execute(
    `select * from is_zamestnanec_login WHERE login = '${username}'`
  );

  if (queryEmployeeRegistered?.rows?.length == 0) {
    return res.status(400).json({ message: "User does not exist!" });
  }

  //if id of employee exist

  var obj = JSON.parse(JSON.stringify(queryEmployeeRegistered?.rows));
  var passwordFromDb = obj[0].HESLO;
  const match = await bcrypt.compare(password, passwordFromDb);

  if (!match) {
    return res.status(400).json({ message: "Bad password!" });
  }

  var employeeType = await getRole(username);
  const token = jwt.sign(
    {
      username: username,
      role: employeeType,
      id_employee: obj[0].ID_ZAMESTNANEC,
    },
    "TODOOOSecret",
    {
      expiresIn: 300,
    }
  );

  console.log("User " + username + " logged in");
  return res.json({ auth: true, token: token, result: username });
});

async function getRole(username: number) {
  //TODO vytvorit spolocny subor pre pomocne funkcie
  const connection = await getDBConnection();
  const query = await connection?.execute(
    `select typ_zamestnanca from is_zamestnanec WHERE id_zamestnanec = ${username
      .toString()
      .slice(2)}`
  );
  var obj = JSON.parse(JSON.stringify(query?.rows));
  var type = obj[0].TYP_ZAMESTNANCA;
  if (type == "1") {
    var role = "Zdravotnik";
  } else {
    var role = "Administrator";
  }
  return role;
}

loginRouter.get("/auth", validateToken, (req: Request, res: Response) => {
  res.send("Authorized.");
  return true;
});

export default loginRouter;
