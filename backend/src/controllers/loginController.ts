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
    `select * from is_zamestnanec_login WHERE id_zamestnanec = ${username}`
  );

  if (queryEmployeeRegistered?.rows?.length == 1) {
    //if id of employee exist

    const passwordQuery = await connection?.execute(
      `select heslo from is_zamestnanec_login WHERE id_zamestnanec = ${username}`
    );

    var obj = JSON.parse(JSON.stringify(passwordQuery?.rows));
    var passwordFromDb = obj[0].HESLO;
    bcrypt.compare(password, passwordFromDb).then(async (match) => {
      if (!match) {
        res.status(400).json({ message: "Login unsuccessful!" });
      } else {
        var employeeType = await getRole(username);
        const token = jwt.sign({ username: username,
          role: employeeType
         }, "TODOOOSecret", {
          expiresIn: 300,
        });
        
        console.log("User " + username + " logged in");
        res.json({ auth: true, token: token, result: username });
      }
    });
   
  }
});

async function  getRole ( username: number) { //TODO vytvorit spolocny subor pre pomocne funkcie 
  const connection = await getDBConnection();
  const passwordQuery = await connection?.execute(
    `select typ_zamestnanca from is_zamestnanec WHERE id_zamestnanec = ${username}`
  );
  var obj = JSON.parse(JSON.stringify(passwordQuery?.rows));
  var type = obj[0].TYP_ZAMESTNANCA;
  console.log(type);
  if(type == "1"){
    var role = "Zdravotnik";
  } else { 
    var role = "Administrator";
  }
  return role;
};


loginRouter.get("/auth", validateToken, (req: Request, res: Response) => {
  res.send("Authorized.");
});

export default loginRouter;
