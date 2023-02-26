import { comparePassword, generateHashPassword } from "../helper/hashpassword";
import { generateToken, getCurrentUser } from "../helper/jwt";
import {
  BlockUser,
  ForgetPassword,
  RegisterSchema,
  ResetPassword,
  UserUpdateSchema,
} from "../schema/registerSchema";
import { Express, Request, Response } from "express";
const cloudinary = require("cloudinary");
import { AppDataSource } from "../PGDB/data-source";
import { User } from "../entity/User";
import { Role } from "../entity/Role";
import { generateOTP } from "../helper/generateRandomOTP";
import { transporter } from "../helper/nodeMailer";
import { Like } from "typeorm";
import { UpdateUserRole } from "../schema/roleSchema";

const userModel = require("../MongoDB/Schema/UserSchema");
let nodemailer = require("nodemailer");
const mongoose = require("mongoose");
type CurrentUser = {
  id: number;
};
const userRepo = AppDataSource.getRepository(User);
const roleRepo = AppDataSource.getRepository(Role);

export async function register(
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  try {
    const validate = await RegisterSchema.validateAsync(req.body);

    // try {
    const hashedPassword: any = await generateHashPassword(validate?.password);
    // const roles = new Role();
    const repo = AppDataSource.getRepository(Role);
    const roles: any = await repo.findOne({
      where: {
        name: "student",
      },
    });
    const user = new User();
    user.email = validate.email;
    user.password = hashedPassword;
    user.roleId = roles;
    const userRepo = AppDataSource.getRepository(User);
    const saveUser = await userRepo.save(user);
    console.log(saveUser);
    if (saveUser) {
      res.status(202).send({ message: "successfully registered" });
    }
    // } catch (err:any) {
    //   res.status(402).send({ error: true, message: err.message });
    //   throw err
    // }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
}

export async function StudentRegister(
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  try {
    const validate = await RegisterSchema.validateAsync(req.body);
    // try {
    const hashedPassword: any = await generateHashPassword(validate?.password);
    // const roles = new Role();
    const repo = AppDataSource.getRepository(Role);
    const roles: any = await repo.findOne({
      where: {
        name: "student",
      },
    });
    const user = new User();
    user.email = validate.email;
    user.password = hashedPassword;
    user.roleId = roles;
    const userRepo = AppDataSource.getRepository(User);
    const saveUser = await userRepo.save(user);
    console.log(saveUser);
    if (saveUser) {
      res.status(202).send({ message: "successfully registered", status: 202 });
    }
    // } catch (err:any) {
    //   res.status(402).send({ error: true, message: err.message });
    //   throw err
    // }
  } catch (err: any) {
    throw err;
    res.status(404).send({ error: true, message: err.message });
  }
}

export async function login(
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  try {
    const validate = await RegisterSchema.validateAsync(req.body);
    try {
      const repo = AppDataSource.getRepository(User);
      const user: any = await repo.findOne({
        relations: {
          roleId: true,
        },
        where: {
          email: validate.email,
          blocked: false,
        },
      });
      if (user) {
        const checkPassword: Boolean = await comparePassword(
          user.password,
          validate.password
        );
        if (checkPassword) {
          const accessToken: any = await generateToken(user);

          const result = await repo.update(user.id, {
            deviceId: validate.deviceId,
          });

          const checkIfAlreadyExist = await userModel.findOne({
            username: user.email,
          });
          console.log(checkIfAlreadyExist);
          if (validate.deviceId) {
            console.log(validate.deviceId);
            if (!checkIfAlreadyExist) {
              const chatUser = await userModel.create({
                username: user.email,
                displayName: user.firstName,
                deviceId: validate.deviceId,
              });
              console.log(chatUser);
            }
          }

          res.json({
            access_token: accessToken,
            message: "Login successful !!",
            status: 200,
          });
        } else {
          res.json({
            message: "Invalid password !!",
            status: 404,
          });
        }
      } else {
        res.json({
          message: "No email found or Blocked",
          status: 404,
        });
      }
    } catch (err: any) {
      throw err
      // res.status(422).send({ error: true, message: err.message });;
    }
  } catch (err: any) {
    res.status(422).send({ error: true, message: err.message, status: 422 });
  }
}

// export async function update(req: any, res: Response):Promise<void> {
//   try {
//     const token = req?.headers["authorization"]?.split(" ")[1];
//     const currentUser = getCurrentUser(token || "");

//     const validate = await UserPatchSchema.validateAsync(req.body);

//     if (req?.file) {
//       const imageUrl = await cloudinary.uploader.upload(req?.file?.path);
//       const user = await prisma.user.update({
//         where: {
//           id: currentUser?.id,
//         },
//         data: {
//           name: validate.name,
//           phone_Int: validate.phoneNumber,
//           address: validate.address,
//           avatar: imageUrl?.secure_url,
//         },
//       });
//       res.json(user);
//     } else {
//       const user = await prisma.user.update({
//         where: {
//           id: currentUser?.id,
//         },
//         data: validate,
//       });
//       res.json(user);
//     }

//     if (!currentUser) throw new Error("Something went wrong!!");
//   } catch (err: any) {
//     res.status(422).send({ error: true, message: err.message });;
//   }
// }

export async function getUser(req: Request, res: Response): Promise<void> {
  try {
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: CurrentUser = getCurrentUser(authHeader || "");
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOneOrFail({
      where: {
        id: currentUser.id,
      },
      relations: [
        "roleId",
        "classes.subjectId.semesterId",
        "classes.subjectId.semesterId.departmentId",
      ],
    });
    // user?.password = null;
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("No use found");
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
}

export async function updateUser(req: any, res: Response): Promise<void> {
  try {
    const validate = await UserUpdateSchema.validateAsync(req.body);
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: CurrentUser = getCurrentUser(authHeader || "");
    const repo = AppDataSource.getRepository(User);
    if (req?.file) {
      const imageUrl = await cloudinary.uploader.upload(req?.file?.path);
      validate.avatar = imageUrl?.secure_url;
    }
    console.log(validate);
    const user = await repo.update(currentUser.id, validate);
    if (user) {
      res.json("user successfully updated");
    } else {
      res.status(404).send("No use found");
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
}
// export async function countAllusers():Promise<number> {
//   return await prisma.user.count({where:{
//     deleted:false
//   }})

// }

// export async function getAllUsers(req:Request,res:Response):Promise<void> {
//   try{
//     const totalUser =  await countAllusers();
//     const skip:any = req.query?.skip||0
//     const take:any = req.query?.take||totalUser+1
//     console.log(totalUser)
//     const data = await prisma.user.findMany({
//       skip:  parseInt(skip),
//       take: parseInt(take),
//     });
//     res.status(200).json(data)
//   }catch(err:any){
//     res.json(err.message)
//   }

// }

export async function forgetPassword(req: any, res: Response): Promise<void> {
  try {
    const validate = await ForgetPassword.validateAsync(req.body);
    const repo = AppDataSource.getRepository(User);
    const randomOTP = generateOTP();
    const user = await repo.update(
      { email: validate.email },
      {
        forgetPassword: randomOTP,
      }
    );

    const mailData = {
      from: "giribipin04@gmail.com", // sender address
      to: validate.email, // list of receivers
      subject: "Sending Email using Node.js",
      text: "That was easy!",
      html: `<b>Hey there! </b>   <b>We received a request to reset the password for your account with email address: bipingiri27@gmail.com </b>    <b>To reset your account please use provided OTP below.</b> <b> </b>          <br>  Your OTP for reset password OTP is: ${randomOTP}<br/>`,
    };
    transporter.sendMail(mailData, function (err: any, info: any) {
      if (err) console.log(err);
      else
        res.status(200).json({
          message: "check your email",
          status: 200,
        });
    });
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
}

export async function resetPassword(req: any, res: Response): Promise<void> {
  try {
    const validate = await ResetPassword.validateAsync(req.body);
    const repo = AppDataSource.getRepository(User);
    const hashPassword: any = await generateHashPassword(validate.password);
    const verifyOTP = await repo.findOne({
      where: {
        forgetPassword: validate.otp,
      },
    });
    console.log(verifyOTP);
    if (verifyOTP) {
      await repo
        .update(
          { forgetPassword: validate.otp },
          {
            password: hashPassword,
          }
        )
        .then(async () => {
          await repo.update(
            {
              forgetPassword: validate.otp,
            },
            {
              forgetPassword: "",
            }
          );
        });
      res.status(202).json({
        message: "Successfully Reset password",
      });
    } else {
      res.status(401).json({
        message: "invalid opt",
      });
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
}

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const totalUser = await countAllusers();
    const skip: any = req.query?.skip || 0;
    const take: any = req.query?.take || totalUser + 1;
    const searchData: any = req.query?.search || null;
    const repo = AppDataSource.getRepository(User);
    console.log(searchData);
    const searchQuery: any = `%${searchData}%`;
    if (
      searchData === "null" ||
      searchData === null ||
      searchData === undefined ||
      searchData === "undefined"
    ) {
      const users = await repo.find({
        relations: ["roleId", "hod"],
        order: {
          updatedAt: "DESC",
        },
        skip: parseInt(skip),
        take: parseInt(take),
      });
      res.json(users);
    } else {
      const users = await repo.find({
        relations: ["roleId", "hod"],
        where: {
          email: Like(searchQuery),
        },
        order: {
          updatedAt: "DESC",
        },
        skip: parseInt(skip),
        take: parseInt(take),
      });
      res.json(users);
    }
  } catch (err: any) {
    res.json(err);
  }
};

export async function countAllusers(): Promise<number> {
  const repo = AppDataSource.getRepository(User);
  return await repo.count({
    where: {
      deleted: false,
    },
  });
}

export const updateUserRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validate = await UpdateUserRole.validateAsync(req.body);
    const result = await userRepo.update(validate.userId, {
      roleId: validate.roleId,
    });
    res.json({
      status: 202,
      message: "Successfully updated role",
    });
  } catch (err: any) {
    res.json({ error: err?.message });
  }
};

export const blockUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const validate = await BlockUser.validateAsync(req.body);
    const result = await userRepo.update(validate.userId, {
      blocked: true,
    });
    res.json({
      status: 202,
      message: "Successfully blocked users",
    });
  } catch (err: any) {
    res.json({ error: err?.message });
  }
};

export const viewBlockUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await userRepo.find({
      where: {
        blocked: true,
      },
    });
    res.json({
      result,
    });
  } catch (err: any) {
    res.json({ error: err?.message });
  }
};
