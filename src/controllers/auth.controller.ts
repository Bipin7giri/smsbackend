import { comparePassword, generateHashPassword } from "../helper/hashpassword";
import { generateToken, getCurrentUser } from "../helper/jwt";
import { RegisterSchema, UserUpdateSchema } from "../schema/registerSchema";
import { Express, Request, Response } from "express";
const cloudinary = require("cloudinary");
import { AppDataSource } from "../DB/data-source";
import { User } from "../entity/User";
import { Role } from "../entity/Role";

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
      res.status(202).send({ message: "successfully registered" });
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
      const user = await repo.findOne({
        relations: {
          roleId: true,
        },
        where: {
          email: validate.email,
        },
      });
      console.table(user);
      if (user) {
        const checkPassword: Boolean = await comparePassword(
          user.password,
          validate.password
        );
        if (checkPassword) {
          const accessToken: any = await generateToken(user);
          res.status(200).json({
            access_token: accessToken,
            message: "Login successful !!",
          });
        } else {
          res.status(404).json({
            message: "Invalid password !!",
          });
        }
      } else {
        res.status(404).json({
          message: "No email found",
        });
      }
    } catch (err: any) {
      // res.status(422).send({ error: true, message: err.message });;
    }
  } catch (err: any) {
    res.status(422).send({ error: true, message: err.message });
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

    validate.password = await generateHashPassword(validate.password);
    const token: string = req?.headers["authorization"]?.split(" ")[1] || "";
    const currentUser: CurrentUser = getCurrentUser(token || "");
    const repo = AppDataSource.getRepository(User);
    console.log(req.file);
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
