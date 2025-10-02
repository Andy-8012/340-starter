const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul class='navul'>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors"></a>'
            grid += '<div class="namePrice">'
            grid += '<hr>'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the vehicle view HTML
* ************************************ */
Util.buildVehicleDetails = async function (data) {
    let div
    let inv_id = data[0].inv_id
    let inv_make = data[0].inv_make
    let inv_model = data[0].inv_model
    let inv_year = data[0].inv_year
    let inv_description = data[0].inv_description
    let inv_image = data[0].inv_image
    let inv_thumbnail = data[0].inv_thumbnail
    let inv_price = data[0].inv_price
    let formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(inv_price)
    let inv_miles = data[0].inv_miles
    let inv_color = data[0].inv_color
    let calssification_id = data[0].calssification_id
    if (data.length > 0) {
        div = '<div id="vehicle-details">'

        div += '<img src="' + inv_image + '" alt ="vehicleimage">'
        div += '<div class="vehicle-info">'
        div += '<h2>' + inv_year + ' ' + inv_make + ' ' + inv_model + '</h2>'
        div += '<p>Price: ' + formattedPrice + '</p>'
        div += '<p>Mileage: ' + inv_miles.toLocaleString('en-US') + '</p>'
        div += '<p>Description: ' + inv_description + '</p>'
        div += '</div>'

        div += '</div>'
    } else {
        div = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return div

}

/* **************************************
* Build the Classification List for Add inventory page
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
        '<select name="classification_id" id="classification_id" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util