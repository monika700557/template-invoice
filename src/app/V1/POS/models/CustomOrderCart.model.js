const mongoose = require('mongoose');

const CustomOrderCartSchema = mongoose.Schema({}, {
    collection: 'tbl_custom_orderCart',
    strict: false,
    timestamps: true,
});

CustomOrderCartSchema.pre('save', function (next) {
    this.set({ 'user_actions.created_by': user().id, 'user_actions.updated_by': user().id });
    next();
});

CustomOrderCartSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
    this.set({ 'user_actions.updated_by': user().id });
    next();
});


var myDB;
var CustomOrderCartTable;

module.exports = function (DB) {
    myDB = mongoose.connection.useDb(DB);
    CustomOrderCartTable = myDB.model('tbl_custom_orderCart', CustomOrderCartSchema);
    return CustomOrderCartTable;
}


/** POS Models **/
module.exports.init = function () {
    return CustomOrderCartTable;
}

module.exports.getCustomOrderCart = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        CustomOrderCartTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getCustomOrderCarts = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        CustomOrderCartTable.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};


module.exports.addCustomOrderCart = (args = {}) => {
    return new Promise((resolve) => {
        CustomOrderCartTable.create(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        })
    });
};

module.exports.updateCustomOrderCart = (args = {}, data = {}) => {
    return new Promise((resolve) => {
        var updateData = {
            '$set': data
        };
        CustomOrderCartTable.updateOne(args, updateData, function (err, result) {
            if (result?.modifiedCount >= 1) {
                resolve(true);
            } else {
                resolve(false);

            }
        });
    });
}



module.exports.unsetCustomOrderCart = (args = {}, data) => {
    return new Promise((resolve) => {
        var updatedata = {
            '$unset': data
        };
        CustomOrderCartTable.updateOne(args, updatedata, function (err, result) {
            if (result) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

module.exports.removeOneCustomOrder = (args = {}) => {
    return new Promise((resolve) => {
        CustomOrderCartTable.deleteOne(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        })
    });
};


module.exports.updateManyCustomOrder = (args = {}, data = {}) => {
    return new Promise((resolve) => {
        var updateData = {
            '$set': data
        };
        CustomOrderCartTable.updateMany(args, updateData, function (err, result) {
            if (result) {
                resolve(true);
            } else {
                resolve(true);
            }
        });
    });
}




module.exports.deleteManyCustomOrderCart = (args = {}) => {
    return new Promise((resolve) => {
        CustomOrderCartTable.deleteMany(args, function (err, result) {
            if (result) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}
/** End Custom Cart Table **/


