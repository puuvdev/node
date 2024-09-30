// src/controllers/maianController.ts
import { Request, Response } from "express";
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
    return res.status(302).json({ message: error });
  }
};
