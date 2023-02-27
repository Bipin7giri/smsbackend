import { AppDataSource } from "./PGDB/data-source";
import { Role } from "./entity/Role";
import { User } from "./entity/User";

export const connectDb = () => {
  AppDataSource.initialize()
    .then(async () => {
      // create admin

      const repo = AppDataSource.getRepository(User);
      const countIfuser = await repo.count();
      console.log(countIfuser);
      if (countIfuser === 0) {
        const admin = new Role();
        const student = new Role();
        const teacher = new Role();
        const accountant = new Role();
        admin.name = "admin";
        admin.roles = ["admin", "teacher", "accountant", "student"];
        student.name = "student";
        student.roles = ["student"];
        teacher.name = "teacher";
        teacher.roles = ["teacher"];
        accountant.name = "accountant";
        accountant.roles = ["accountant"];
        teacher.name = "teacher";
        teacher.roles = ["teacher"];
      
        let roles = await AppDataSource.manager.save(admin);
        await AppDataSource.manager.save(student);
        await AppDataSource.manager.save(teacher);
        await AppDataSource.manager.save(accountant);

        const user = new User();
        user.firstName = "admin";
        user.lastName = "admin";
        user.email = "admin@example.com";
        user.password =
          "$2a$12$DzW7DBrHUTYFRie7ycF8ouIubkmsrKzNcZs2bZ6mtWpY4FDYoTwhm";
        user.roleId = roles;
        user.isEmailVerified = true
        let adminCreated = await AppDataSource.manager.save(user);
        console.log(adminCreated);
      }
      console.log("connected to PGDB");
    })
    .catch((error) => console.log(error));
};
