// Needed Resources 
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

/* Login Details
account_firstname: Basic
account_lastname: Client
account_email: basic@340.edu
account_password: I@mABas1cCl!3nt

account_firstname: Happy
account_lastname: Employee
account_email: happy@340.edu
account_password: I@mAnEmpl0y33

account_firstname: Manager
account_lastname: User
account_email: manager@340.edu
account_password: I@mAnAdm!n1strat0r
*/

// Process the login attempt this may be changed or removed in the future
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin))

//route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));


router.post('/register', regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount));

// Default Accout Route
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagementView));


module.exports = router;