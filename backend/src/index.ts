import express, { Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import getDBConnection from "./database";

dotenv.config({ path: "../.env" });

const port = process.env.BACKEND_PORT;

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs)choke on 204
  })
);

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const queryResult = await connection?.execute(
    `select id_krajiny, nazov_krajiny from is_krajina WHERE id_krajiny LIKE 'SVK'`
  );
  res.json({ rows: queryResult?.rows });
});


const registerController = require('./controllers/registerController'); 
app.use('/register', registerController);

const loginController = require('./controllers/loginController'); 
app.use('/', loginController);


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
