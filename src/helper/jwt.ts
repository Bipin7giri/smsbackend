const jwt = require("jsonwebtoken");
import { Request, Response } from "express";
import { copyFileSync } from "fs";
import { roles } from "../ENUMS/RoleEnum";

export async function generateToken(user: any, expire?: any): Promise<any> {
  try {
    return await jwt.sign(
      {
        // email: user.email,
        id: user.id,
        roles: user.roleId.roles,
        email: user.email,
      },
      "json_web_token_pw",
      {
        expiresIn: "11h",
      }
    );
  } catch (err: any) {
    console.log(err);
  }
}

export function tokenValidation(req: Request, res: Response, next: any) {
  let authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Remove "Bearer " from the authHeader
    authHeader = authHeader.slice(7, authHeader.length);
  }
  if (!authHeader) {
    return res.status(401).json({
      message: "No access_token found",
    });
  }
  jwt.verify(authHeader, "json_web_token_pw", (err: any, user: any) => {
    try {
      if (err)
        return res.status(401).json({
          message: "unauthorized access",
        });

      next();
    } catch (err) {
      res.send(err);
    }
  });
}

export function getCurrentUser(token: string): any {
  // function parseJwt (token) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());

  // }
}

export async function AdminAuthorization(
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  let authHeader: any = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Remove "Bearer " from the authHeader
    authHeader = authHeader.slice(7, authHeader.length);
  }
  const user = JSON.parse(
    Buffer.from(authHeader.split(".")[1], "base64").toString()
  );
  for (let index = 0; index < user.roles.length; index++) {
    if (user.roles[index] === roles.ADMIN) {
      next();
      return;
    } else {
      res.status(401).json({
        message: "unauthorized access you are not admin!!",
      });
      return;
    }
  }
}

export async function StudentAuthorization(
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  let authHeader: any = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Remove "Bearer " from the authHeader
    authHeader = authHeader.slice(7, authHeader.length);
  }
  const user = JSON.parse(
    Buffer.from(authHeader.split(".")[1], "base64").toString()
  );
  for (let index = 0; index < user.roles.length; index++) {
    if (user.roles[index] === roles.STUDENT) {
      next();
      return;
    } else {
      res.status(401).json({
        message: "unauthorized access you are not student!!",
      });
      return;
    }
  }
}

export async function TeacherAuthorization(
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  let authHeader: any = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Remove "Bearer " from the authHeader
    authHeader = authHeader.slice(7, authHeader.length);
  }
  const user = JSON.parse(
    Buffer.from(authHeader.split(".")[1], "base64").toString()
  );
  let counter: number = 0;
  for (let index = 0; index < user.roles.length; index++) {
    counter = counter + 1;
    if (user.roles[index] === "teacher") {
      next();
      return;
    }
  }
  if (counter === user.roles.length) {
    res.status(401).json({
      message: "unauthorized access you are not Teacher!!",
    });
  }
}

export async function HODAuthorization(
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  let authHeader: any = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Remove "Bearer " from the authHeader
    authHeader = authHeader.slice(7, authHeader.length);
  }
  const user = JSON.parse(
    Buffer.from(authHeader.split(".")[1], "base64").toString()
  );
  let counter: number = 0;
  for (let index = 0; index < user.roles.length; index++) {
    counter = counter + 1;
    if (user.roles[index] === "hod") {
      next();
      return;
    }
  }
  if (counter === user.roles.length) {
    res.status(401).json({
      message: "unauthorized access you are not HOD!!",
    });
  }
}

export async function AccountAuthorization(
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  try {
    let authHeader: any = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const user = JSON.parse(
      Buffer.from(authHeader.split(".")[1], "base64").toString()
    );
    let counter: number = 0;
    for (let index = 0; index < user.roles.length; index++) {
      counter = counter + 1;
      if (user.roles[index] === roles.ACCOUNTANT) {
        next();
        return;
      }
    }
    if (counter === user.roles.length) {
      res.status(401).json({
        message: "unauthorized access you are not HOD!!",
      });
    }
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
}
