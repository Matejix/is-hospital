import getDBConnection from "../database";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import validateToken from "./validateToken";

const loginRouter = express.Router();

loginRouter.post("/", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const connection = await getDBConnection();

  const queryEmployeeRegistered = await connection?.execute(
    `select * from is_zamestnanec_login WHERE login = '${username}'`
  );

  if (queryEmployeeRegistered?.rows?.length == 1) {
    //if id of employee exist


    var obj = JSON.parse(JSON.stringify(queryEmployeeRegistered?.rows));
    var passwordFromDb = obj[0].HESLO;

    if (passwordFromDb == password) {
      const token = jwt.sign({ username: username }, "TODOOOSecret", {
        expiresIn: 300,
      });
      console.log("User " + username + " logged in");
      res.json({ auth: true, token: token, result: username });
    }
  } else {
    res.send({ message: "Login unsuccessful" });
  }
});

/*
const verifyJWT = (req: Request,res: Response, next) => {
    const token = req.headers["x-access-token"]
    if(!token){
      res.send("Unauthorized!")
    } else {
      jwt.verify(token.toString(), "TODOOOSecret", (err,decoded) => {
        if (err){
          res.json({ auth: false, message : "Unauthorized!"}); 
        } else { 
          req.userId = decoded.username;
          next();
        }
      })
    }
}

loginRouter.get('/auth', verifyJWT, (req,res)=> {
  res.send("Authorized.")
})
  */

loginRouter.get("/auth", validateToken, (req: Request, res: Response) => {
  console.log("hre");
  res.send("Authorized.");
});

export default loginRouter;
