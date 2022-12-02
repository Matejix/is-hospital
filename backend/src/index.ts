import express, { Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import getDBConnection from "./database";

import loginRouter from "./controllers/loginController";
import registerRouter from "./controllers/registerController";

import report1 from "./reports/report1";
import report2 from "./reports/report2";
import report3 from "./reports/report3";
import report5 from "./reports/report5";
import report6 from "./reports/report6";
import report8 from "./reports/report8";
import report10 from "./reports/report10";
import report11 from "./reports/report11";
import report12 from "./reports/report12";
import report9 from "./reports/report9";

import patientServiceRouter from "./controllers/patientServiceController";
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
app.use("/report-1", report1);
app.use("/report-2", report2);
app.use("/report-3", report3);
app.use("/report-5", report5);
app.use("/report-6", report6);
app.use("/report-8", report8);
app.use("/report-9", report9);
app.use("/report-10", report10);
app.use("/report-11", report11);
app.use("/report-12", report12);
app.use("/patientservice", patientServiceRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
