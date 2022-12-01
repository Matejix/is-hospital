import express, { Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import getDBConnection from "./database";

import loginRouter from "./controllers/loginController";
import registerRouter from "./controllers/registerController";

import report8 from "./reports/report8";
import report12 from "./reports/report12";
import report11 from "./reports/report11";

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

// Reporty
app.use("/report-8", report8);
app.use("/report-11", report11);
app.use("/report-12", report12);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
