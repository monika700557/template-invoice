const mongoose = require('mongoose');

// Setup schema


const StockAnalysisSchema = mongoose.Schema({}, {
    collection: 'tbl_stock_analysis',
    strict: false,
    timestamps: true
});

StockAnalysisSchema.pre('save', function (next) {
    this.set({ 'user_actions.created_by': user().id, 'user_actions.updated_by': user().id });
    next();
});

StockAnalysisSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function (next) {
    this.set({ 'user_actions.updated_by': user().id });
    next();
});

const TransactionPaymentSchema = mongoose.Schema({}, {
    collection: 'tbl_transactionPayment',
    strict: false,
    timestamps: true
});

TransactionPaymentSchema.pre('save', function (next) {
    this.set({ 'user_actions.created_by': user().id, 'user_actions.updated_by': user().id });
    next();
});

TransactionPaymentSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function (next) {
    this.set({ 'user_actions.updated_by': user().id });
    next();
});

const CashRegisterRecordSchema = mongoose.Schema({}, {
    collection: 'tbl_CashRegisterRecord',
    strict: false,
    timestamps: true
});

CashRegisterRecordSchema.pre('save', function (next) {
    this.set({ 'user_actions.created_by': user().id, 'user_actions.updated_by': user().id });
    next();
});

CashRegisterRecordSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function (next) {
    this.set({ 'user_actions.updated_by': user().id });
    next();
});

const RepairTableSchema = mongoose.Schema({}, {
    collection: 'tbl_repair',
    strict: false,
    timestamps: true
});


RepairTableSchema.pre('save', function (next) {
    this.set({ 'user_actions.created_by': user().id, 'user_actions.updated_by': user().id });
    next();
});

RepairTableSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function (next) {
    this.set({ 'user_actions.updated_by': user().id });
    next();
});




let myDB;
let StockAnalysis_Table, TransactionPayment_Table, CashRegisterRecord_Table, Repair_Table;

module.exports = function (DB) {
    myDB = mongoose.connection.useDb(DB);

    CashRegisterRecord_Table = myDB.model('tbl_CashRegisterRecord', CashRegisterRecordSchema);
    TransactionPayment_Table = myDB.model('tbl_transactionPayment', TransactionPaymentSchema);
    StockAnalysis_Table = myDB.model('tbl_stock_analysis', StockAnalysisSchema);
    Repair_Table = myDB.model('tbl_repair', RepairTableSchema);
    return;
}


module.exports.getCashRegisterRecord = () => {
    return new Promise((resolve) => {
        CashRegisterRecord_Table.findOne({}, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        })
    });
};


/** StockAnalysis Models **/
module.exports.StockAnalysis = function () {
    return StockAnalysis_Table;
}

module.exports.getStockAnalysis = (args = {}) => {
    return new Promise((resolve) => {
        StockAnalysis_Table.findOne(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.getStockAnalysis_ = (args = {}) => {
    return new Promise((resolve) => {
        StockAnalysis_Table.find(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.updateStockAnalysis = (args = {}, data) => {
    return new Promise((resolve) => {
        var updateData = {
            '$set': data
        };

        StockAnalysis_Table.updateMany(args, updateData, function (err, result) {
            if (result) {
                resolve(true);
            }
        });
    });
}

module.exports.updateStockAnalysisOne = (args = {}, data) => {
    return new Promise((resolve) => {
        var updateData = {
            '$set': data
        };

        StockAnalysis_Table.updateOne(args, updateData, function (err, result) {
            if (result) {
                resolve(true);
            }
        });
    });
}

module.exports.addStockAnalysis = (args = {}) => {
    return new Promise((resolve) => {
        StockAnalysis_Table.create(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        })
    });
};
/** StockAnalysis Models **/

/** TransactionPayment Models **/
module.exports.TransactionPayment = function () {
    return TransactionPayment_Table;
}

module.exports.getTransactionPayment = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        TransactionPayment_Table.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getTransactionPayments = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        TransactionPayment_Table.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.updateTransactionPayment = (args = {}, data) => {
    return new Promise((resolve) => {
        var updateData = {
            '$set': data
        };
        TransactionPayment_Table.updateMany(args, updateData, function (err, result) {
            if (result) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

module.exports.updateTransactionPaymentOne = (args = {}, data) => {
    return new Promise((resolve) => {
        var updateData = {
            '$set': data
        };
        TransactionPayment_Table.updateOne(args, updateData, function (err, result) {
            if (result) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}


module.exports.addTransactionPayment = (args = {}) => {
    return new Promise((resolve) => {
        TransactionPayment_Table.create(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        })
    });
};
/**  TransactionPayment Models **/





/** Repair_Table Models **/
module.exports.RepairOrder = function () {
    return Repair_Table;
}

module.exports.getRepairOrder = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        Repair_Table.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.getRepairOrders = (args = {}) => {
    return new Promise((resolve) => {
        Repair_Table.find(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.updateRepairOrder = (args = {}, data) => {
    return new Promise((resolve) => {
        var updateData = {
            '$set': data
        };

        Repair_Table.updateMany(args, updateData, function (err, result) {
            if (result) {
                resolve(true);
            }
        });
    });
}

module.exports.addRepairOrder = (args = {}) => {
    return new Promise((resolve) => {
        Repair_Table.create(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        })
    });
};
/**  Repair_Table Models **/

