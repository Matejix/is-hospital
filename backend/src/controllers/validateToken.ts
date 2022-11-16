import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwtPayload";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["x-access-token"];
  console.log(token);
  if (!token) {
    res.send("Unauthorized!");
  } else {
    try {
      const { username } = jwt.verify(
        token.toString(),
        "TODOOOSecret"
      ) as JwtPayload;
      req.userId = username;
      next();
    } catch (error) {
      res.json({ auth: false, message: "Unauthorized!" });
    }
  }
};

export default validateToken;
