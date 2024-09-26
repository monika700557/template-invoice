const _ = require('underscore');
const forEachAsync = require('foreachasync').forEachAsync;
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const masterModel = require('./Masters.model');
const dateHelper = require('../../Helper/DateHelper.js')
const priceHelper = require('../../Helper/PriceHelper.js')
const Barcode = require('jsbarcode');
// const sharp = require('sharp');
// const { createCanvas, loadImage } = require("canvas");
// Setup schema
const SupplierSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_Vendor',
    strict: false,
});

const LocationSchema = mongoose.Schema({}, {
    collection: 'tbl_location',
    strict: false,
});

const CustomerSchema = mongoose.Schema({}, {
    collection: 'tbl_customers',
    strict: false,
});


// const ProductWishlistSchema = mongoose.Schema({
//     'customer_id': { type: String, required: true }, 'SKU': String, 'product_id': String, 'status': { type: Number, default: 1 }, 'type': String
// }, {
//     collection: 'tbl_product_wishlist',
//     stict: false,
//     timestamps: true,
// })


// ProductWishlistSchema.pre('save', function (next) {
//     this.set({ 'user_actions.created_by': user().id, 'user_actions.updated_by': user().id });
//     next();
// });

// ProductWishlistSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
//     this.set({ 'user_actions.updated_by': user().id });
//     next();
// });
const SalesPersonSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_SalesPerson',
    strict: false,
});

const GeneralSetupSchema = mongoose.Schema({}, {
    collection: 'tbl_General_setup',
    strict: false,
});
const TaxsetupSchema = mongoose.Schema({}, {
    collection: 'tbl_Tax_setup',
    strict: false,
});

const CustomerAddSchema = mongoose.Schema({}, {
    collection: 'tbl_customers_address',
    strict: false,
});

var myDB;
var SupplierTable, LocationTable, CustomerTable, SalesPersonTable, CustomerAddressTable, GeneralSetupTable, TaxsetupTable;

module.exports = function (DB) {
    myDB = mongoose.connection.useDb(DB);
    SupplierTable = myDB.model('tbl_Master_Vendor', SupplierSchema);
    TaxsetupTable = myDB.model('tbl_Tax_setup', TaxsetupSchema);
    LocationTable = myDB.model('tbl_location', LocationSchema);
    CustomerTable = myDB.model('tbl_customers', CustomerSchema);
    SalesPersonTable = myDB.model('tbl_Master_SalesPerson', SalesPersonSchema);
    GeneralSetupTable = myDB.model('tbl_General_setup', GeneralSetupSchema);
    // ProductWishlist = myDB.model('tbl_product_wishlist', ProductWishlistSchema);
    CustomerAddressTable = myDB.model('tbl_customers_address', CustomerAddSchema);
    return;
}

module.exports.init = function () {
    return CustomerAddressTable;
}

/** Supplier Models **/
module.exports.Supplier = function () {
    return SupplierTable;
}

module.exports.getSupplier = (args = {}) => {
    return new Promise((resolve) => {
        SupplierTable.findOne(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.getSuppliers = (args = {}) => {
    return new Promise((resolve) => {
        args.is_delete = 0;
        SupplierTable.find(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};
/** End Supplier Models **/

/** Location Models **/
module.exports.Location = function () {
    return LocationTable;
}

module.exports.getLocation = (args = {}) => {
    return new Promise((resolve) => {
        LocationTable.findOne(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve(false);
            }
        }).lean();
    });
};

module.exports.getLocations = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        args.is_delete = 0;
        LocationTable.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
/** End Location Models **/

/** Customer Models **/
module.exports.Customer = function () {
    return CustomerTable;
}

module.exports.getCustomer = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        CustomerTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
module.exports.getCustomers = (args = {}, projection = {}, options = {}) => {
    return new Promise((resolve) => {
        CustomerTable.find(args, projection, options, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
/** End Customer Models **/

/** SalesPerson Models **/
module.exports.SalesPerson = function () {
    return SalesPersonTable;
}

module.exports.getSalesPerson = (args = {}) => {
    return new Promise((resolve) => {
        SalesPersonTable.findOne(args, function (err, result) {
            if (result) {
                result.name = result.name + " " + result.lname;
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.getSalesPersons = (args = {}, projection = {}, options = {}) => {
    return new Promise((resolve) => {
        args.is_delete = 0;
        SalesPersonTable.find(args, projection, options, async function (err, result) {
            if (result) {
                await result.forEach(element => {
                    element.name = element.name + " " + element.lname;
                });
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};
/** End Sales Person Models **/

/** Gis Setup Models **/
module.exports.getGeneralSetup = () => {
    return new Promise((resolve) => {
        GeneralSetupTable.findOne({}, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};
module.exports.getGeneralSetupDelivery = () => {
    return new Promise((resolve) => {
        let date = new Date();
        let allstatics = new Date(date.setDate(date.getDate() + 7));
        let responce = { repairOrder_delivery: allstatics, customOrder_delivery: allstatics };
        GeneralSetupTable.findOne({}, function (err, result) {
            if (result) {
                if (result?.repairOrder_delivery?.status === "1") {
                    const duedate = result?.repairOrder_delivery?.weeks;
                    const caldays = 7 * parseInt(duedate);
                    let NewDateresult = new Date(date.setDate(date.getDate() + caldays));
                    responce.repairOrder_delivery = NewDateresult;
                }

                if (result?.customOrder_delivery?.status === "1") {
                    const duedate = result?.customOrder_delivery?.weeks;
                    const caldays = 7 * parseInt(duedate);
                    let NewDateresult = new Date(date.setDate(date.getDate() + caldays));
                    responce.customOrder_delivery = NewDateresult;
                }
                if (result?.reserve_delivery?.status === "1") {
                    const duedate = result?.reserve_delivery?.weeks;
                    const caldays = parseInt(duedate);
                    let NewDateresult = new Date(date.setDate(date.getDate() + caldays));
                    responce.reserve_delivery = NewDateresult;
                }
                else {
                    let NewDateresult = new Date(date.setDate(date.getDate() + 1));
                    responce.reserve_delivery = NewDateresult;
                }

            }
            resolve(responce);
        });
    });
};

/** End Gis Setup Models **/

// module.exports.createQR = (dataForQRcode, center_image, width, cwidth) => {
//     return new Promise(async (resolve) => {
//         const canvas = createCanvas(width, width);
//         QRCode.toCanvas(
//             canvas,
//             dataForQRcode,
//             {
//                 heigth: 150,
//                 width: 150,
//                 errorCorrectionLevel: "H",
//                 margin: 1,
//                 color: {
//                     dark: "#000000",
//                     light: "#ffffff",
//                 },
//             }
//         );
//         const ctx = canvas.getContext("2d");
//         const img = await loadImage(center_image);
//         const center = (width - cwidth) / 2;
//         ctx.drawImage(img, center, center, cwidth, cwidth);
//         let result = canvas.toDataURL("image/jpeg");
//         if (result) {
//             resolve(result)
//         } else {
//             resolve();
//         }

//     })
// }

module.exports.createQR = (data) => {
return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAACMCAYAAACuwEE+AAAAAklEQVR4AewaftIAAAWzSURBVO3BS64cOBLAQFKo+1+Z42XCC/UI9dwfICPsF9b6Px3WenBY68FhrQcffqPyd6qYVKaKb6hMFZPKVHGjclNxo/KiYlL5O1VMh7UeHNZ6cFjrwYe/UPGTVH6SyjcqblS+oXJT8Y2Kn6Ryc1jrwWGtB4e1Hnx4pPKi4hsqU8VUMalMFZPKTcWfVHGjMlW8UHlR8eKw1oPDWg8Oaz348B+jMlXcqEwVk8o3KiaVFyr/JYe1HhzWenBY68GHf5mKSeWfVPGNipuK/5LDWg8Oaz04rPXgw6OKP0nlGxUvKiaVb1RMKjcVP6niTzqs9eCw1oPDWg8+/AWVf1LFpHKjMlVMKlPFTcWkMlVMKlPFpHKjMlXcqPydDms9OKz14LDWgw+/qfgnVbxQmSpuKl6o3KhMFX9SxT/psNaDw1oPDms9+PAblZuKG5UXFd+omFReVLyomFQmlW9UvFCZKiaVb1RMh7UeHNZ6cFjrwYe/UDGpTBUvKm5Upoqp4qbiRmVSmSpuVKaKSWWqmFQmlX+TipvDWg8Oaz04rPXgw6OKSWWquFF5oXJTcaMyVUwqk8pNxTcqJpWp4oXKpHJTMam8OKz14LDWg8NaDz48UnmhMlVMKlPFpDJV3KhMFTcVk8pUcaMyVdyoTBWTyk3Fi4oXKlPFdFjrwWGtB4e1Hnz4TcWkclNxUzGpTBU3FTcqU8WkclNxo/JPqphUpopJZVKZKqaKF4e1HhzWenBY64H9woXKVDGpTBV/kspUMalMFZPKTcWNyouKSeWmYlK5qbhReVFxc1jrwWGtB4e1HtgvDCo/qWJSmSomlaniRuUnVUwqNxWTylRxo3JTcaMyVbxQmSpuDms9OKz14LDWA/uFL6hMFX8nlaliUpkqJpUXFZPKVDGpvKi4Ubmp+IbKVDEd1npwWOvBYa0HH36jclMxVdyo3FTcqNxUTCovKiaVqWJSuVGZKiaVqWJSmSpeqEwVNyovDms9OKz14LDWgw+PVG4qbiomlRcVNxWTyqRyUzGp/J0qJpWbihcqU8WLw1oPDms9OKz1wH7hQmWqmFSmihuVm4pJZar4SSo3FZPKVDGpTBU3KlPFC5WbiknlpuLmsNaDw1oPDms9sF8YVKaKSWWquFGZKm5UXlRMKlPFpPKNikllqphUpooXKt+o+EmHtR4c1npwWOvBh99UTCovVG5UvlExqUwVk8pNxaTyDZUXKjcVk8pUMalMKlPFpHJTMR3WenBY68FhrQcffqMyVfykiknlhcpUMalMFTcqU8VPqripmFQmlRcVk8qkMlVMKjeHtR4c1npwWOuB/cIXVKaKG5UXFTcqf1LFT1L5RsWNyk3FpDJV3BzWenBY68FhrQcfHqlMFTcqU8WkMlVMKlPFTcWkMlVMKjcqLyomlZuKSWWq+EbFTcWLw1oPDms9OKz14MNvVG4qvqHyomJSmSomlRcVNypTxaQyqUwV31D5SSovKqbDWg8Oaz04rPXAfuFfRGWq+IbKi4pJ5aZiUpkqXqhMFS9Ubiomlani5rDWg8NaDw5rPbBfGFT+ThU3KjcV31C5qbhReVExqdxUTCpTxaTyouLFYa0Hh7UeHNZ68OEvVPwklRuVm4oblaliUpkqJpVJ5UXFjcpUMancVLyouFG5qZgOaz04rPXgsNaDD49UXlR8o+JGZaqYVG5UXlRMKpPKVDFVvFD5kyomlZvDWg8Oaz04rPXgw79MxY3KVDGpTBU3KlPFn6QyVUwVNypTxaRyozJVvDis9eCw1oPDWg8+/MupTBWTyo3KC5UXFTcqU8U3Kr5RcVNxc1jrwWGtB4e1Hnx4VPEnqXyjYlKZKiaVb6hMFTcqNxWTylTxTzqs9eCw1oPDWg8+/AWVf7OKSeVFxY3KC5WpYlK5UZkqJpU/SWWqmA5rPTis9eCw1gP7hbX+T4e1HhzWenBY68H/ACnoHTrUmQ7RAAAAAElFTkSuQmCC"
}
module.exports.createBarCode = (data) => {
    return new Promise(async (resolve) => {
        const canvas = createCanvas();
        Barcode(canvas, data, { heigth: 40, width: 4, displayValue: false });
        let result = canvas.toDataURL("image/png");
        if (result) {
            resolve(result);
        } else {
            resolve();
        }
    })
}

/** Gis Tax setup Models **/
module.exports.getTaxsetup = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        TaxsetupTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.getTaxsetups = (args = {}, projection = {}, options = {}) => {
    return new Promise((resolve) => {
        TaxsetupTable.find(args, projection, options, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};


/** Gis  Tax setup Models **/


/* get list of inventory for pos */

module.exports.getMyinventoryList = (args = {}) => {
    return new Promise(async (resolve) => {
        new masterModel(ORG_DB);
        let filter = {};
        if (args?.search) {
            // var search = { $regex: args.search, $options: 'i' }
            let search = priceHelper.serachRegexPattern(args?.search);

            filter['$or'] = [{ SKU: search }];
        }
        if (args?.ids?.length) {
            filter._id = { $in: args.ids }
        }
        filter = _.extend(filter || {}, { 'status.pu_status': 1 });
        filter.po_QTY = { '$gte': 1 }
        filter.type = { $nin: ['POS_Order', 'reserve', 'custom_order'] };
        let projection = {
            name: 1, ID: 1, product_id: 1, Stones: 1, main_image: 1, SKU: 1, Item: 1, type: 1, Collection: 1, Metal: 1, Stone: 1, Size: 1, stock_id: 1, po_QTY: 1, price: 1, PriceDetails: 1, status: 1, customer_id: 1, Customer_id: 1, remark: 1, po_order_id: 1, transaction_stock_id: 1, amount_total: 1, location_id: 1, warehouse_id: 1, delivery_date: 1,
            product_type: 1, is_product: 1, is_variant: 1, is_design: 1, NetWt: 1, GrossWt: 1, extra_po_information: 1, transfer_from_loc: 1
        }
        await masterModel.PoProduct().find(filter, projection, {}).lean().then(async (result) => {
            if (result) {
                forEachAsync(result, async (element) => {
                    // var currency;
                    element.pos_no = element?.pos?.ref ? element?.pos?.ref : '';
                    if (element?.status?.warehouse_status == 1) {
                        var warehouse_main = element.warehouse_id;
                        element.warehouse_id = element?.location_id;
                        element.location_id = warehouse_main;
                        await module.exports.getLocation({ _id: element?.warehouse_id }).then((location) => {
                            element.warehouse_location_name = location?.name;
                        });
                    }
                    element.location_zone = await masterModel.getLocationZones({ 'location_id': element?.location_id }).then((zone) => {
                        var location_zone_arr = [];
                        forEachAsync(zone, async (zonedata) => {
                            location_zone_arr.push(zonedata.zone);
                        })
                        element.location_zone = location_zone_arr.join(",");
                        return;
                    });
                    await module.exports.getLocation({ _id: element?.location_id }).then((location) => {
                        element.location_name = location?.name;
                        // currency = location.currency;
                    });
                    element.id = element._id.toString();
                    element.due_days = await dateHelper.getDueDays(element.delivery_date);
                    element.retailprice_Inc = priceHelper.getRetailPrice(element?.PriceDetails, element.location_id);
                    element.price = element.retailprice_Inc;
                    element.delivery_date = dateHelper.getDateInOrganisationFormat(element?.delivery_date);
                    element.item_name = await masterModel.getItem({ _id: element?.Item }).then((Item) => {
                        return Item?.name || "-";
                    });
                    element.collection_name = await masterModel.getCollection({ _id: element?.Collection }).then((Collection) => {
                        return Collection?.name || "-"
                    });
                    element.metal_name = await masterModel.getMetal({ _id: element?.Metal }).then((metal) => {
                        return metal?.name;
                    });
                    element.customer_name = await module.exports.getCustomer({ _id: element?.pos?.customer_id }).then((customer) => {
                        return customer?.fname ? customer?.fname : '' + customer?.lname ? customer?.lname : ''
                    });
                    element.size_name = await masterModel.getSize({ _id: element?.Size }).then((size) => size?.code);
                    let stones = element?.Stones?.filter(function (stone) {
                        return stone?.Variant != '0';
                    }).map(function (stone) {
                        return stone.stone;
                    })
                    element.stone_name = await masterModel.getStones({ _id: { $in: stones } }).then((size) => {
                        return _.map(size, 'name');
                    }).then((stone_names) => {
                        return stone_names.join(',');
                    });
                    element.aging = 0;
                    element.status_type = "stock";
                    if (element?.status?.warehouse_status == 1 && element.location_id != element.warehouse_id) {
                        element.status_type = 'warehouse';
                    }
                    if (element?.status?.is_stock_transfer_started == 1) {
                        element.status_type = 'transit';
                        if (element?.status?.warehouse_status > 1) {
                            element.warehouse_location_name = element.location_name;
                            if (element?.transfer_from_loc) {
                                await module.exports.getLocation({ _id: element?.transfer_from_loc }).then((location) => {
                                    element.location_name = location?.name;
                                });
                            }
                        }
                    }
                    if (element?.type == "reserve") {
                        element.status_type = 'reserve';
                    }
                    if (element.location_id == element.warehouse_id) {
                        element.warehouse_id = "";
                        element.warehouse_location_name = "";
                    }
                    delete element._id;
                    delete element.po_order_id;
                    delete element.type;
                    delete element.customer_id;
                    delete element.remark;
                    delete element.amount_total;
                    delete element.warehouse_id;
                    delete element.Collection;
                    delete element.Item;
                    return element;
                }).then(function () {
                    resolve(result);
                });
            } else {
                resolve();
            }
        });
    });
};

/* get list of inventory for pos */
