import { AppDataSource } from "./DB/data-source"
import { Role } from "./entity/Role"
import { User } from "./entity/User"

export const connectDb = ()=>{
    AppDataSource.initialize().then(async () => {

        // create admin

        const repo =  AppDataSource.getRepository(User)
           const countIfuser = await repo.count();
           console.log(countIfuser)
           if(countIfuser === 0){
           const admin = new Role()
           const student = new Role()
           const teacher =new Role()
           const accountant = new Role ()
           admin.name = 'admin'
           admin.roles = ['admin','teacher','accountant','student'];
           student.name = 'student'
           student.roles = ['student']
           teacher.name  = 'teacher'
           teacher.roles = ['teacher']
           accountant.name = 'accountant'
           accountant.roles = ['accountant']
        
            let roles =    await AppDataSource.manager.save(admin)
            await AppDataSource.manager.save(student)
            await AppDataSource.manager.save(teacher)
            await AppDataSource.manager.save(accountant)
                           
     
        const user = new User()
        user.firstName = "admin"
        user.lastName = "admin"
        user.email = 'admin@example.com'
        user.password = '$2a$12$DzW7DBrHUTYFRie7ycF8ouIubkmsrKzNcZs2bZ6mtWpY4FDYoTwhm'
        user.roleId = roles
        let adminCreated =    await AppDataSource.manager.save(user)
        console.log(adminCreated);
    }
      

        // // console.log("Inserting a new user into the database...")
        // // const user = new User()
        // // user.firstName = "Timber"
        // // user.lastName = "Saw"
        // // user.age = 25
        // // await AppDataSource.manager.save(user)
        // // console.log("Saved a new user with id: " + user.id)
    
        // console.log("Loading users from the database...")
        // const users = await AppDataSource.manager.find(User)
        // console.log("Loaded users: ", users)
    
        console.log("connected to db")
    
    }).catch(error => console.log(error))
}


