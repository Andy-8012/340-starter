const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
        errors: null,
    })
}

invCont.buildByVehicleId = async function (req, res, next) {
    const vehicle_id = req.params.vehicleId
    const data = await invModel.getVehicleByVehicleId(vehicle_id)
    const div = await utilities.buildVehicleDetails(data)
    let nav = await utilities.getNav()
    const vehicleName = data[0].inv_make + ' ' + data[0].inv_model
    res.render("./inventory/vehicle", {
        title: vehicleName,
        nav,
        div,
        errors: null,
    })
}

invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Management",
        nav,
        errors: null,
    })

}

invCont.buildAddClassificationView = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    })

}

/* ****************************************
*  Process adding new Classificaiton
* *************************************** */
invCont.addClassification = async function (req, res) {
    let nav = await utilities.getNav()
    const { classification_name } = req.body

    const regResult = await invModel.addClassification(classification_name)

    if (regResult) {
        nav = await utilities.getNav()
        req.flash(
            "notice",
            `Congratulations, you added ${classification_name} to the database.`
        )
        res.status(201).render("inventory/management", {
            title: "Management",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, adding the classification failed")
        res.status(501).render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null,
        })
    }
}

invCont.buildAddInventoryView = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors: null,
    })

}

/* ****************************************
*  Process adding new Inventory
* *************************************** */
invCont.addInventory = async function (req, res) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body

    const regResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id)

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you added ${inv_make} ${inv_model} to the database.`
        )
        res.status(201).render("inventory/management", {
            title: "Management",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, adding the inventory failed")
        res.status(501).render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classificationList,
            errors: null,
        })
    }
}


module.exports = invCont