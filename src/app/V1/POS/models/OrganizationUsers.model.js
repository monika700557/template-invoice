var mongoose = require('mongoose');

// Setup schema
var Schema = mongoose.Schema({}, {
    strict: false,
});

const myDB = mongoose.connection.useDb('GisAdminDb');
var table = module.exports = myDB.model('tbl_organization_users', Schema);

function getOne(args) {
    return new Promise((resolve) => {
        table.findOne(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
}
module.exports.getOne = getOne;