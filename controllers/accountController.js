//required resources
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: 3600, // 1 hour in seconds
            });
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }
        else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}


/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}


/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccountManagementView(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/account-management", {
        title: "Account Management",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildUpdateAccountView(req, res, next) {
    const account_id = parseInt(req.params.account_id)
    let nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(account_id)
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const loggedInEmail = decoded.account_email;
    res.render("account/update-account", {
        title: "Update Account Info",
        nav,
        account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        loggedInEmail,
        errors: null,
    })
}

/* ****************************************
*  Process Account Information Update
* *************************************** */
async function updateAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_id } = req.body

    const updateResult = await accountModel.updateAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_id
    )

    if (updateResult) {
        req.flash(
            "notice",
            `Congratulations, you updated your account information.`
        )
        req.flash(
            "notice",
            `First Name: ${updateResult.rows[0].account_firstname}`
        )
        req.flash(
            "notice",
            `Last Name: ${updateResult.rows[0].account_lastname}`
        )
        req.flash(
            "notice",
            `Email: ${updateResult.rows[0].account_email}`
        )
        //added req.sessionsave to allow the flash messages to display before redirecting.
        req.session.save(() => {
            res.redirect("/account/");
        });
    } else {
        req.flash("notice", "Sorry, the account update failed.")
        res.status(501).render("account/update-account", {
            title: "Update Account Info",
            nav,
            errors: null,
        })
    }
}

/* ****************************************
*  Process Password Information Update
* *************************************** */
async function updateAccountPassword(req, res) {
    let nav = await utilities.getNav()
    const { account_id, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/update-account", {
            title: "Update Account Info",
            nav,
            errors: null,
        })
    }

    const updateResult = await accountModel.updateAccountPassword(
        hashedPassword,
        account_id
    )

    if (updateResult) {
        req.flash(
            "notice",
            `Congratulations, you updated your password.`
        )
        //added req.sessionsave to allow the flash messages to display before redirecting.
        req.session.save(() => {
            res.redirect("/account/");
        });
    } else {
        req.flash("notice", "Sorry, the account update failed.")
        res.status(501).render("account/update-account", {
            title: "Update Account Info",
            nav,
            errors: null,
        })
    }
}

async function logout(req, res) {
    res.clearCookie("jwt")
    res.redirect("/account/login")

}

async function buildEmployeeManagementView(req, res, next) {
    let nav = await utilities.getNav()
    const data = await accountModel.getAccountInfoByType("Employee")
    console.log(data)
    let table = await utilities.buildEmployeeDetails(data)
    res.render("./account/employee-management", {
        title: "Employee Management",
        nav,
        table,
        errors: null,
    })

}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildDeleteAccountView(req, res, next) {
    const account_id = parseInt(req.params.account_id)
    let nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/delete-account", {
        title: "Delete Account Info",
        nav,
        account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        errors: null,
    })
}

async function deleteAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_id } = req.body

    const deleteResult = await accountModel.deleteAccount(account_id)

    if (deleteResult) {
        req.flash(
            "notice",
            `Congratulations, you deleted ${account_firstname} ${account_lastname} from the database.`
        )
        res.redirect("/account/")
    } else {
        req.flash("notice", "Sorry, the delete failed.")
        res.status(501).render("account/delete-confrim", {
            title: "Delete Account Info",
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        })
    }
}


module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagementView, buildUpdateAccountView, updateAccount, updateAccountPassword, logout, buildEmployeeManagementView, buildDeleteAccountView, deleteAccount }