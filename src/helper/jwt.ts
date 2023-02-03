const jwt = require("jsonwebtoken");
import { Express, Request, Response } from "express";


export async function genterateToken(user: any, expire?: any): Promise<any> {
  try{
    console.log(user)
    const token = await jwt.sign(
      {
        // email: user.email,
        id: user.id,
        roles: user.roleId.roles,
        email:user.email
      },
      "json_web_token_pw",
      {
        expiresIn: "10h",
      }
    );
    return token;
  }catch(err:any){
  console.log(err)
  }

}

export function tokenValidation(req: Request, res: Response, next: any) {
  const authHeader = req.headers["authorization"];
  var token = req?.headers["authorization"]?.split(" ")[1];

  if (!authHeader) {
    return res.status(404).json({
      message: "No access_token found",
    });
  }
  jwt.verify(token, "json_web_token_pw", (err: any, user: any) => {
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
  const user = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  return user;

  // }
}

export async function AdminAuthorization(
  req: Request,
  res: Response,
  next: any,
): Promise<void> {
  var token: any = req?.headers["authorization"]?.split(" ")[1];
  const user = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  for (let index = 0; index < user.roles.length; index++) {
    if (user.roles[index] ===  'admin') {
      next()
      return
     } else {
        res.status(401).json({
         message: "unauthorized access you are not admin!! sorry baby",
       });
       return
     }
  }

}



export async function StudentAuthorization(
  req: Request,
  res: Response,
  next: any,
): Promise<void> {
  var token: any = req?.headers["authorization"]?.split(" ")[1];
  const user = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  for (let index = 0; index < user.roles.length; index++) {
    if (user.roles[index] ===  'student') {
      next()
      return
     } else {
        res.status(401).json({
         message: "unauthorized access you are not student!! sorry baby",
       });
       return
     }
  }

}


export async function TeacherAuthorization(
  req: Request,
  res: Response,
  next: any,
): Promise<void> {
  var token: any = req?.headers["authorization"]?.split(" ")[1];
  const user = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  for (let index = 0; index < user.roles.length; index++) {
    if (user.roles[index] ===  'teacher') {
      next()
      return
     } else {
        res.status(401).json({
         message: "unauthorized access you are not student!! sorry baby",
       });
       return
     }
  }
}