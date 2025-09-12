-- Insert Tony Stark into `account`
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Update acount type to Admin for Tony Stark
UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';
-- Delete Tony Stark from `account`
DELETE FROM account
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';
-- Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors"
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- Select the make and model of all sport cars in inventory
SELECT i.inv_make,
    i.inv_model,
    c.classification_name
FROM inventory as i
    INNER JOIN classification as c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
-- Update all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail
UPDATE inventory
SET inv_image = REPLACE(inv_image, 'images/', 'images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehicles/');