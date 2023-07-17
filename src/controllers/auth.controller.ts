import { comparePassword, generateHashPassword } from "../helper/hashpassword";
import { generateToken, getCurrentUser } from "../helper/jwt";
import {
  BlockUser,
  ForgetPassword,
  RegisterSchema,
  ResetPassword,
  UserUpdateSchema,
  VerifyOTP,
} from "../validationSchema/registerSchema";
import { NextFunction, Request, Response } from "express";
const cloudinary = require("cloudinary");
import { AppDataSource } from "../PGDB/data-source";
import { User } from "../entity/User";
import { Role } from "../entity/Role";
import { generateOTP } from "../helper/generateRandomOTP";
import { transporter } from "../helper/nodeMailer";
import { Like } from "typeorm";
import { UpdateUserRole } from "../validationSchema/roleSchema";
import { MAILDATA } from "../Interface/NodeMailerInterface";
import { roles } from "../ENUMS/RoleEnum";
import { userRepo } from "../Repository";

const userModel = require("../MongoDB/Schema/UserSchema");
type CurrentUser = {
  id: number;
};

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
    user.emailOtp = generateOTP();
    const userRepo = AppDataSource.getRepository(User);
    const saveUser = await userRepo.save(user);

    const mailData: MAILDATA = {
      to: user.email,
      subject: "[SMS] Account Verification Request",
      html: `<div>
            <p>Hello,</p>
            <p style="color: green;">We have successfully registered your account with email address: ${user.email}</p>
            <p>To verify your account please use provided OTP below</p>
            <p>Your OTP for account verification opt is: ${saveUser.emailOtp}</p>
            <p>If you didn’t request to reset your password, please ignore this email or reset your password to protect your account.</p>
      </div>`,
      from: "giribipin04@gmail.com",
      text: "Verifiication",
    };
    const email = await transporter.sendMail(
      mailData,
      function (err: any, info: any) {
        if (err) console.log(err);
      }
    );

    if (saveUser) {
      res.status(202).send({ message: "successfully registered" });
    }
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
    const randomOTP = generateOTP();
    const user = new User();
    user.email = validate.email;
    user.password = hashedPassword;
    user.roleId = roles;
    user.emailOtp = randomOTP;
    const userRepo = AppDataSource.getRepository(User);
    const saveUser = await userRepo.save(user);
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

export async function adminlogin(
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
          roleId: {
            name: roles.ADMIN,
          },
        },
      });

      if (user) {
        const checkPassword: Boolean = await comparePassword(
          user.password,
          validate.password
        );
        if (checkPassword) {
          if (user?.isEmailVerified === false) {
            res.json({
              message:
                "Not verified Email please check our email for verification",
            });
            return;
          }
          const accessToken: any = await generateToken(user);

          const result = await repo.update(user.id, {
            deviceId: validate.deviceId,
          });

          const checkIfAlreadyExist = await userModel.findOne({
            username: user.email,
          });
          if (validate.deviceId) {
            if (!checkIfAlreadyExist) {
              const chatUser = await userModel.create({
                username: user.email,
                displayName: user.firstName,
                deviceId: validate.deviceId,
              });
            }
          }

          res.json({
            access_token: accessToken,
            message: "Login successful !!",
            status: 200,
          });
        } else {
          res.status(401).json({
            message: "Invalid password !!",
            status: 404,
          });
        }
      } else {
        res.status(401).json({
          message: "No email found or Blocked",
          status: 404,
        });
      }
    } catch (err: any) {
      throw err;
      // res.status(422).send({ error: true, message: err.message });;
    }
  } catch (err: any) {
    res.status(422).send({ error: true, message: err.message, status: 422 });
  }
}
export async function accountantlogin(
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
          roleId: {
            name: roles.ACCOUNTANT,
          },
        },
      });

      if (user) {
        const checkPassword: Boolean = await comparePassword(
          user.password,
          validate.password
        );
        if (checkPassword) {
          if (user?.isEmailVerified === false) {
            res.json({
              message:
                "Not verified Email please check our email for verification",
            });
            return;
          }
          const accessToken: any = await generateToken(user);

          const result = await repo.update(user.id, {
            deviceId: validate.deviceId,
          });

          const checkIfAlreadyExist = await userModel.findOne({
            username: user.email,
          });
          if (validate.deviceId) {
            if (!checkIfAlreadyExist) {
              const chatUser = await userModel.create({
                username: user.email,
                displayName: user.firstName,
                deviceId: validate.deviceId,
              });
            }
          }

          res.json({
            access_token: accessToken,
            message: "Login successful !!",
            status: 200,
          });
        } else {
          res.status(401).json({
            message: "Invalid password !!",
            status: 404,
          });
        }
      } else {
        res.status(401).json({
          message: "No email found or Blocked",
          status: 404,
        });
      }
    } catch (err: any) {
      throw err;
      // res.status(422).send({ error: true, message: err.message });;
    }
  } catch (err: any) {
    res.status(422).send({ error: true, message: err.message, status: 422 });
  }
}

export async function hodLogin(
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
          roleId: {
            name: roles.HOD,
          },
        },
      });

      if (user) {
        const checkPassword: Boolean = await comparePassword(
          user.password,
          validate.password
        );
        if (checkPassword) {
          if (user?.isEmailVerified === false) {
            res.json({
              message:
                "Not verified Email please check our email for verification",
            });
            return;
          }
          const accessToken: any = await generateToken(user);

          const result = await repo.update(user.id, {
            deviceId: validate.deviceId,
          });

          const checkIfAlreadyExist = await userModel.findOne({
            username: user.email,
          });
          if (validate.deviceId) {
            if (!checkIfAlreadyExist) {
              const chatUser = await userModel.create({
                username: user.email,
                displayName: user.firstName,
                deviceId: validate.deviceId,
              });
            }
          }

          res.json({
            access_token: accessToken,
            message: "Login successful !!",
            status: 200,
          });
        } else {
          res.status(401).json({
            message: "Invalid password !!",
            status: 404,
          });
        }
      } else {
        res.status(401).json({
          message: "No email found or Blocked",
          status: 404,
        });
      }
    } catch (err: any) {
      throw err;
      // res.status(422).send({ error: true, message: err.message });;
    }
  } catch (err: any) {
    res.status(422).send({ error: true, message: err.message, status: 422 });
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
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
          if (user?.isEmailVerified === false) {
            res.json({
              message:
                "Not verified Email please check our email for verification",
            });
            return;
          }
          const accessToken: any = await generateToken(user);

          const result = await repo.update(user.id, {
            deviceId: validate.deviceId,
          });

          const checkIfAlreadyExist = await userModel.findOne({
            username: user.email,
          });
          if (validate.deviceId) {
            if (!checkIfAlreadyExist) {
              const chatUser = await userModel.create({
                username: user.email,
                displayName: user.firstName,
                deviceId: validate.deviceId,
              });
            }
          }

          res.json({
            access_token: accessToken,
            message: "Login successful !!",
            role: user.roleId?.name,
            status: 200,
          });
        } else {
          res.status(401).json({
            message: "Invalid password !!",
            status: 404,
          });
        }
      } else {
        res.status(401).json({
          message: "No email found or Blocked",
          status: 404,
        });
      }
    } catch (err: any) {
      throw err;
      // res.status(422).send({ error: true, message: err.message });;
    }
  } catch (err: any) {
    res.status(422).send({ error: true, message: err.message, status: 422 });
  }
}

export async function studentLogin(
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
          roleId: {
            name: roles.STUDENT,
          },
        },
      });

      if (user) {
        const checkPassword: Boolean = await comparePassword(
          user.password,
          validate.password
        );
        if (checkPassword) {
          if (user?.isEmailVerified === false) {
            res.json({
              message:
                "Not verified Email please check our email for verification",
            });
            return;
          }
          const accessToken: any = await generateToken(user);

          const result = await repo.update(user.id, {
            deviceId: validate.deviceId,
          });

          const checkIfAlreadyExist = await userModel.findOne({
            username: user.email,
          });
          if (validate.deviceId) {
            if (!checkIfAlreadyExist) {
              const chatUser = await userModel.create({
                username: user.email,
                displayName: user.firstName,
                deviceId: validate.deviceId,
              });
            }
          }

          res.json({
            access_token: accessToken,
            message: "Login successful !!",
            status: 200,
          });
        } else {
          res.status(401).json({
            message: "Invalid password !!",
            status: 404,
          });
        }
      } else {
        res.status(401).json({
          message: "No email found or Blocked",
          status: 404,
        });
      }
    } catch (err: any) {
      throw err;
      // res.status(422).send({ error: true, message: err.message });;
    }
  } catch (err: any) {
    res.status(422).send({ error: true, message: err.message, status: 422 });
  }
}

export async function getUser(req: any, res: Response): Promise<void> {
  try {
    const currentUser: any = req.user;
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
    const currentUser: any = req.user;

    const repo = AppDataSource.getRepository(User);
    if (req?.file) {
      const imageUrl = await cloudinary.uploader.upload(req?.file?.path);
      validate.avatar = imageUrl?.secure_url;
    }
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
      subject: "FROM SMS ",
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

export async function verifyEmail(req: any, res: Response): Promise<void> {
  try {
    const validate = await VerifyOTP.validateAsync(req.body);
    const repo = AppDataSource.getRepository(User);
    const verifyOTP = await repo.findOne({
      where: {
        emailOtp: validate.otp,
      },
    });
    if (verifyOTP) {
      await repo.update(
        { emailOtp: validate.otp },
        {
          isEmailVerified: true,
        }
      );
      res.status(202).json({
        message: "Successfully verified",
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
export const unBlockUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validate = await BlockUser.validateAsync(req.body);
    const result = await userRepo.update(validate.userId, {
      blocked: false,
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
