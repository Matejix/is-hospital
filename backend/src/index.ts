import express, { Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import getDBConnection from "./database";

import loginRouter from "./controllers/loginController";
import registerRouter from "./controllers/registerController";

import report5 from "./reports/report5";
import report8 from "./reports/report8";

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

app.use("/register", registerRouter);

app.use("/", loginRouter);

app.use("/report-5", report5);
app.use("/report-8", report8);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
