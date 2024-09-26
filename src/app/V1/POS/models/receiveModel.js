const mongoose = require('mongoose');
var _ = require('underscore');
const CustomOrderCartModel = require('../models/CustomOrderCart.model');
const commonModel = require('../models/Common.model');
const dateHelper = require('../../Helper/DateHelper.js');
const forEachAsync = require('foreachasync').forEachAsync;
const masterModel = require('../models/Masters.model');
const priceHelper = require('../../Helper/PriceHelper.js');

const LayBySchema = mongoose.Schema({}, {
    collection: 'tbl_layBy',
    strict: false,
    timestamps: true,
});

LayBySchema.pre('save', function (next) {
    this.set({ 'user_actions.created_by': user().id, 'user_actions.updated_by': user().id });
    next();
});

LayBySchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
    this.set({ 'user_actions.updated_by': user().id });
    next();
});

const InstallmentSchema = mongoose.Schema({}, {
    collection: 'tbl_Installment',
    strict: false,
    timestamps: true,
});

InstallmentSchema.pre('save', function (next) {
    this.set({ 'user_actions.created_by': user().id, 'user_actions.updated_by': user().id });
    next();
});

InstallmentSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
    this.set({ 'user_actions.updated_by': user().id });
    next();
});

let myDB, LayByTable, InstallmentTable;
module.exports = function (DB) {
    myDB = mongoose.connection.useDb(DB);
    LayByTable = myDB.model('tbl_layBy', LayBySchema);
    InstallmentTable = myDB.model('tbl_Installment', InstallmentSchema);
    return;
}

/** Gis LayByTable Models **/
module.exports.LayBy = function () {
    return LayByTable;
}

module.exports.getLayBy = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        LayByTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getAllLayByList = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        LayByTable.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.createLayBy = (args = {}) => {
    return new Promise((resolve) => {
        LayByTable.create(args, function (err, result) {
            if (result) {
                resolve(result.id);
            } else {
                resolve();
            }
        })
    });
};


module.exports.updateLayBy = (args = {}, data = {}) => {
    return new Promise((resolve) => {
        var updateData = { '$set': data };
        LayByTable.updateOne(args, updateData, function (err, result) {
            if (result.modifiedCount >= 1) {
                resolve(true);
            } else {
                resolve(false);
            }

        });
    });
};

module.exports.updateManyReceive = (data) => {
    return new Promise((resolve) => {
        var updateData = {
            '$set': data
        };
        LayByTable.updateMany(updateData, function (err, result) {
            if (result) {
                resolve(true);
            }
        });
    });
}

/** End Gis LayByTable Models **/

/** Gis LayBy functions **/

module.exports.getLayBylist = (args = {}) => {
    return new Promise(async (resolve) => {
        new commonModel(ORG_DB);
        let show = args?.type;
        let response = [];
        let all = [];
        if (show == 'LayBy' || show == 'ALL') {
            await module.exports.getAllLayByList({}).then(async (result) => {
                if (result) {
                    await forEachAsync(result, async (element) => {
                        let respoonseObj = {
                            'id': element?._id?.toString(),
                            'date': dateHelper.getDateInOrganisationFormat(element?.createdAt),
                            'vr_type': element?.paymentMathod,
                            'vr_no': element?.order_no,
                            'SKU': element?.cart_item_ids?.length,
                            'customer': await commonModel.getCustomer({ _id: element?.customer_id }).then((customer) => customer?.fname ? customer?.fname : ' ' + " " + customer?.lname ? customer?.lname : ' '),
                            'amount': element?.total_amount,
                            'payment': element?.deposit_amount,
                            'outstanding': element?.outstanding_amount,
                            'location': await commonModel.getLocation({ _id: element?.location_id }).then((location) => location?.name ? location?.name : ''),
                            'due_date': dateHelper.getDateInOrganisationFormat(element?.due_date),
                            'status': element?.status,
                            'order_id': element?.order_id,
                            'order_type': 'lay_by',
                            'printURL': element?.printURL
                        };
                        if (element?.custom_order_id) {
                            respoonseObj.custom_order_id = element?.custom_order_id;
                        }
                        if (element?.pay_layby_data) {
                            respoonseObj.pay_layby_data = element?.pay_layby_data;
                        }
                        if (show == 'ALL') {
                            all.push(respoonseObj);
                        } else {
                            response.push(respoonseObj);
                        }
                    })
                    if (show == 'ALL') {
                        // no work
                    } else {
                        if (response.length) {
                            resolve(response);
                        } else {
                            resolve();
                        }
                    }
                }
            })
        }
        if (show == 'Installment' || show == 'ALL') {
            await module.exports.getAllInstallmentList({}).then(async (result) => {
                if (result) {
                    await forEachAsync(result, async (element) => {
                        let respoonseObj = {
                            'id': element?._id?.toString(),
                            'date': dateHelper.getDateInOrganisationFormat(element?.createdAt),
                            'vr_type': element?.paymentMathod + '*' + element?.installment?.length,
                            'vr_no': element?.order_no,
                            'SKU': element?.cart_item_ids?.length,
                            'customer': await commonModel.getCustomer({ _id: element?.customer_id }).then((customer) => customer?.fname ? customer?.fname : ' ' + " " + customer?.lname ? customer?.lname : ' '),
                            'amount': element?.total_amount,
                            'payment': element?.deposit_amount,
                            'outstanding': element?.outstanding_amount,
                            'location': await commonModel.getLocation({ _id: element?.location_id }).then((location) => location?.name ? location?.name : ''),
                            'due_date': dateHelper.getDateInOrganisationFormat(element?.due_date),
                            'status': element?.status,
                            'order_id': element?.order_id,
                            'order_type': 'Installment',
                            'installment': element?.installment,
                            'printURL': element?.printURL
                        };
                        if (element?.custom_order_id) {
                            respoonseObj.custom_order_id = element?.custom_order_id;
                        }
                        if (show == 'ALL') {
                            all.push(respoonseObj);
                        } else {
                            response.push(respoonseObj);
                        }
                    })
                    if (show == 'ALL') {
                        // no work
                    } else {
                        if (response.length) {
                            resolve(response);
                        } else {
                            resolve();
                        }
                    }
                }
            })
        }
        if (show == 'ALL') {
            resolve(all);
        } else {
            resolve();
        }

    });
}

module.exports.getLayBySKUList = (args = {}) => {
    return new Promise(async (resolve) => {
        new CustomOrderCartModel(ORG_DB);
        new commonModel(ORG_DB);
        let filter = {
            _id: args?.id
        }
        let result;
        let response = [];
        if (args?.type == 'lay_by') {
            result = await module.exports.getLayBy(filter);
        }
        if (args?.type == 'Installment') {
            result = await module.exports.getInstallment(filter);
        }
        if (result) {
            await CustomOrderCartModel.getCustomOrderCarts({ _id: { $in: result?.cart_item_ids } }).then(async (data) => {
                if (data) {
                    await forEachAsync(data, async (element) => {
                        let respoonseObj = {};
                        respoonseObj.cart_id = element?._id.toString();
                        respoonseObj.main_image = element?.product_details?.main_image;
                        respoonseObj.name = element?.product_details?.name;
                        respoonseObj.SKU = element?.product_details?.SKU;
                        respoonseObj.stock_id = element?.product_details?.stock_id ? element?.product_details?.stock_id : '';
                        respoonseObj.metal_name = await masterModel.getMetal({ _id: element?.product_details?.Metal }).then((metal) => metal?.name ? metal?.name : '');
                        respoonseObj.size_name = await masterModel.getSize({ _id: element?.product_details?.Size }).then((size) => size?.name ? size?.name : '');
                        respoonseObj.stone_name = '';
                        if (element?.product_details?.Stones) {
                            let stones = element?.product_details?.Stones.map((item) => {
                                if (item?.Variant == 2 || item?.Variant == 1) {
                                    return item?.stone;
                                }
                            });
                            respoonseObj.stone_name = await masterModel.getStones({ _id: { $in: stones } }).then((size) => {
                                return _.map(size, 'name');
                            }).then((stone_names) => {
                                return stone_names.join(',');
                            });
                        }
                        respoonseObj.Qty = element?.Qty;
                        respoonseObj.price = element?.product_details?.retailprice_Inc;
                        respoonseObj.amount = element?.Qty * element?.product_details?.retailprice_Inc;
                        response.push(respoonseObj);
                    })
                    resolve(response);
                } else {
                    resolve();
                }

            })
        } else {
            resolve();
        }

    });
}

module.exports.installments = (args = {}) => {
    let response = [];
    return new Promise(async (resolve) => {
        new commonModel(ORG_DB);
        let date = '';
        let amount = args.amount;
        for (let index = 0; index < args.installment; index++) {
            let respoonseObj = {
                amount: args.amount / args.installment,
                paid: 0,
                id: 'inst_' + index
            }
            respoonseObj.outstanding = amount - respoonseObj.amount;
            respoonseObj.formatted_amount = priceHelper.toFormatPosPrice(respoonseObj.amount)
            if (args.term) {

                if (date != '') {
                    let result = dateHelper.toMongoDate(date);
                    result.setMonth(result.getMonth() + args.term);
                    respoonseObj.date = dateHelper.getDateInPOSFormat(new Date(result).toUTCString());
                    // respoonseObj.formatted_date = dateHelper.toMongoDate(new Date(result).toUTCString());
                    respoonseObj.formatted_date = dateHelper.getDateInPOSFormat(new Date(result).toUTCString(), POS_DATE_FORMAT);
                    date = new Date(result).toUTCString();
                } else {
                    let result = new Date();
                    respoonseObj.date = dateHelper.getDateInPOSFormat(new Date(result).toUTCString());
                    respoonseObj.formatted_date = dateHelper.toMongoDate(new Date(result).toUTCString());
                    date = new Date(result).toUTCString();
                }
            }
            response.push(respoonseObj);
            amount = respoonseObj.outstanding;
        }
        if (response.length) {
            resolve(response);
        } else {
            resolve();
        }
    })
}

/** End Gis LayBy functions **/

/** Gis InstallmentTable Models **/

module.exports.Installment = function () {
    return InstallmentTable;
}


module.exports.createInstallment = (args = {}) => {
    return new Promise((resolve) => {
        InstallmentTable.create(args, function (err, result) {
            if (result) {
                resolve(result.id);
            } else {
                resolve();
            }
        })
    });
};

module.exports.getAllInstallmentList = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        InstallmentTable.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};
module.exports.getInstallment = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        InstallmentTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.updateInstallment = (args = {}, data = {}) => {
    return new Promise((resolve) => {
        var updateData = { '$set': data };
        InstallmentTable.updateOne(args, updateData, function (err, result) {
            if (result.modifiedCount >= 1) {
                resolve(true);
            } else {
                resolve(false);
            }

        });
    });
};
/** End Gis InstallmentTable Models **/