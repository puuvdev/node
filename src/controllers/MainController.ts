// src/controllers/maianController.ts
import { Request, Response } from "express";
import Pos from "../models/Pos";
import classRegistry from "./ClassRegistry";

function findFirstNull(array: any[]): number | boolean {
  const index = array.findIndex((item) => item === undefined);
  return index !== -1 ? index : false;
}

export const main = async (req: Request, res: Response) => {
  try {
    if (req.body) {
      let process = req.body.process ?? null;
      let body = req.body.body ?? null;
      let cls = req.body.cls ?? null;
      let user = req.body.user ?? null;
      console.log(body, process, cls, user, "params");
      const ClassRef = new classRegistry[cls]();
      if (ClassRef && typeof ClassRef[process] === "function") {
        if (user) {
          const pos = await Pos.findOne({ user });
          if (!pos) {
            return res.json("pos not found");
          }
          ClassRef.env = {
            host: pos.host,
            id: pos.id,
            user: pos.user,
            grant_type: "password",
            username: pos.username,
            password: pos.password,
            client_id: pos.client_id,
            client_secret: pos.client_secret,
            refresh_token: pos.refresh_token,
            access_token: pos.access_token,
            expires_in: pos.expires_in,
            expired_at: pos.expired_at,
          };
        }

        const paramKeys = ClassRef.methodParamsMap[process];
        if (paramKeys) {
          if (user) {
            body["user"] = user;
          }
          const params = paramKeys.map((key: string) => body[key]);
          const findExists = findFirstNull(params);

          if (findExists === false) {
            const result = await ClassRef[process].apply(ClassRef, params);
            return res.json(result);
          } else {
            if (typeof findExists === "number") {
              console.log(`methodParams ${paramKeys[findExists]}`);
            }

            return res.json(paramKeys);
          }
        }
        return res.json(paramKeys);
      }

      return res.json(process);
    }
  } catch (error) {
    return res.status(401).json({ message: error });
  }
};
