const utilities = require(".")
const accountModel = require("../models/account-model")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use different email")
                }
            }),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
    return [
        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (!emailExists) {
                    throw new Error("Email doesn't exisit. Please try a different email.")
                }
            }),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return
    }
    next()
}






/*  **********************************
  *  Inventory Validation functions below
  * ********************************* */
/*  **********************************
  *  Add Classificaton Data Validation Rules
  * ********************************* */
validate.addClassificationRules = () => {
    return [
        // firstname is required and must be string
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage("No spaces or special characters allowed. Use only letters and numbers.") // on error this message is sent.
            .custom(async (classification_name) => {
                const classificationExisits = await invModel.checkExistingClassification(classification_name)
                if (classificationExisits) {
                    throw new Error("Classification already exisits. Please enter a different Classification.")
                }
            }),
    ]
}

validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

validate.addInventoryRules = () => {
    return [
        // Vehicle Make: required, alphanumeric and spaces
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^[A-Za-z0-9 ]+$/)
            .withMessage("Vehicle make can only contain letters, numbers, and spaces."),

        // Vehicle Model: required, alphanumeric and spaces
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^[A-Za-z0-9 ]+$/)
            .withMessage("Vehicle model can only contain letters, numbers, and spaces."),

        // Vehicle Year: required, exactly 4 digits
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^\d{4}$/)
            .withMessage("Vehicle year must be exactly 4 digits."),

        // Vehicle Description: required
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Vehicle description is required."),

        // Vehicle Price: required, digits only, max 9 digits
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^\d{1,9}$/)
            .withMessage("Vehicle price must be digits only, up to 9 digits."),

        // Vehicle Miles: required, digits only
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^\d+$/)
            .withMessage("Vehicle miles must be digits only."),

        // Vehicle Color: required, letters only
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^[A-Za-z]+$/)
            .withMessage("Vehicle color must contain only letters."),

        // Classification ID: required
        body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Vehicle classification is required."),
    ];
};

// Checks Add inventory data
validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
            classificationList,

        })
        return
    }
    next()
}

// Checks update inventory data
validate.checkUpdateData = async (req, res, next) => {
    const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/edit-inventory", {
            errors,
            title: "Edit " + inv_make + " " + inv_model,
            nav,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
            classificationList,

        })
        return
    }
    next()
}

module.exports = validate