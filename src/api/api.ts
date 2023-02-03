const router = require("express").Router();
import auth from '../routers/auth.router'
import role from '../routers/role.router'
// import expensescategory from '../routers/expensesCategory.router'
// import expenses from '../routers/expenses.router'
// import income from '../routers/income.router'



// const auth = require("../src/routes/authRouter");
router.use("/auth",auth);
router.use("/",role);
// router.use("/",expensescategory)
// router.use("/",expenses)
// router.use("/",income)


// module.exports = router;aa

export default router;