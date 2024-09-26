const forEachAsync = require('foreachasync').forEachAsync;
const mongoose = require('mongoose');
const commonModel = require('./Common.model');
// Setup schema 
const VoucherSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_VoucherType',
    strict: false,
});

const Repairchema = mongoose.Schema({}, {
    collection: 'tbl_Master_Repair',
    strict: false,
});
const ItemSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_Item',
    strict: false,
    timestamps: true,
});

const CollectionSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_Collection',
    strict: false,
    timestamps: true,
});

const MetalSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_Metal',
    strict: false,
    timestamps: true,
});

const SizeSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_ItemSize',
    strict: false,
    timestamps: true,
});

const StoneSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_Stone',
    strict: false,
    timestamps: true,
});

const StoneGroupSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_StoneGroup',
    strict: false,
});

const LocationZoneSchema = mongoose.Schema({}, {
    collection: 'tbl_location_zone',
    strict: false,
});

const LocationSchema = mongoose.Schema({}, {
    collection: 'tbl_location',
    strict: false,
    timestamps: true,
});

// const tbl_repairSchema = mongoose.Schema({}, {
//     collection: 'tbl_repair',
//     strict: false,
// });

const ProductSchema = mongoose.Schema({}, {
    strict: false,
});

const PoProductSchema = mongoose.Schema({}, {
    strict: false,
});
const PoOrderSchema = mongoose.Schema({}, {
    strict: false,
});

const MasterShapeSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_Shape',
    strict: false,
    timestamps: true,
});
const MasterShapeGroupSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_ShapeGroup',
    strict: false,
    timestamps: true,
});

const StoneColorSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_StoneColor',
    strict: false,
    timestamps: true,
});

const StoneClaritySchema = mongoose.Schema({}, {
    collection: 'tbl_Master_Clarity',
    strict: false,
    timestamps: true,
});

const CuletSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_Culet',
    strict: false,
    timestamps: true,
});

const GridleSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_Gridle',
    strict: false,
    timestamps: true,
});

const FluoresenceSchema = mongoose.Schema({}, {
    collection: 'tbl_Fluoresence',
    strict: false,
    timestamps: true,
});

const PolishSchema = mongoose.Schema({}, {
    collection: 'tbl_Polish',
    strict: false,
    timestamps: true,
});

const SymmetrySchema = mongoose.Schema({}, {
    collection: 'tbl_Symmetry',
    strict: false,
    timestamps: true,
});

const StoneCutSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_Cut',
    strict: false,
    timestamps: true,
});

// const CronJobRequestSchema = mongoose.Schema({}, {
//     collection: 'tbl_Master_CronJobRequest',
//     timestamps: true,
//     strict: false
// });

// const VendorSchema = mongoose.Schema({}, {
//     collection: 'tbl_Master_Vendor',
//     timestamps: true,
//     strict: false
// });

const settingTypeSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_SettingType',
    strict: false,
});

const ColorSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_Color',
    strict: false,
});


const CurrencyExchangeSchema = mongoose.Schema({}, {
    collection: 'tbl_Currencyexchange',
    strict: false,
    timestamps: true,
});
// Setup schema
const ProductImageSchema = mongoose.Schema({}, {
    strict: false,
    timestamps: true
});
ProductImageSchema.pre('save', function (next) {
    this.set({ 'user_actions.created_by': user().id, 'user_actions.updated_by': user().id });
    next();
});
ProductImageSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
    this.set({ 'user_actions.updated_by': user().id });
    next();
});

const EComCategorieSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_Category',
    strict: false,
    timestamps: true,
});

const StoneSizeSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_StoneSize',
    strict: false,
    timestamps: true,
});

var myDB;
var StoneSize, EComCategorieTable, PoOrderTable, RepairCategorieTable, ProductTable, ProductImageTable, PoProductTable, MasterShapeGroupTable, SymmetryTable, settingType, ColorTable, StoneGroupTable, PolishTable, FluoresenceTable, GridleTable, CuletTable,/* CronJobRequest, */VoucherTable,/* VendorTable,*/ ItemTable, CollectionTable, MetalTable, SizeTable, StoneTable, LocationTable, LocationZoneTable,/* RepairTable,*/ MasterShapeTable, StoneColorTable, StoneClarityTable, StoneCutTable, CurrencyExchangeTable;

module.exports = function (DB) {
    myDB = mongoose.connection.useDb(DB);
    EComCategorieTable = myDB.model('tbl_Master_Category', EComCategorieSchema);
    RepairCategorieTable = myDB.model('tbl_Master_Repair', Repairchema);
    ProductImageTable = myDB.model('tbl_products_images', ProductImageSchema);
    // CronJobRequest = myDB.model('tbl_Master_CronJobRequest', CronJobRequestSchema);
    VoucherTable = myDB.model('tbl_Master_VoucherType', VoucherSchema);
    ItemTable = myDB.model('tbl_Master_Item', ItemSchema);
    CollectionTable = myDB.model('tbl_Master_Collection', CollectionSchema);
    MetalTable = myDB.model('tbl_Master_Metal', MetalSchema);
    SizeTable = myDB.model('tbl_Master_ItemSize', SizeSchema);
    StoneTable = myDB.model('tbl_Master_Stone', StoneSchema);
    StoneGroupTable = myDB.model('tbl_Master_StoneGroup', StoneGroupSchema);
    LocationTable = myDB.model('tbl_location', LocationSchema);
    LocationZoneTable = myDB.model('tbl_location_zone', LocationZoneSchema);
    // RepairTable = myDB.model('tbl_repair', tbl_repairSchema);
    ProductTable = myDB.model('tbl_products', ProductSchema);
    PoProductTable = myDB.model('tbl_po_products', PoProductSchema);
    PoOrderTable = myDB.model('tbl_po_orders', PoOrderSchema);
    SymmetryTable = myDB.model('tbl_Symmetry', SymmetrySchema);
    FluoresenceTable = myDB.model('tbl_Fluoresence', FluoresenceSchema);
    PolishTable = myDB.model('tbl_Polish', PolishSchema);
    MasterShapeTable = myDB.model('tbl_Master_Shape', MasterShapeSchema);
    MasterShapeGroupTable = myDB.model('tbl_Master_ShapeGroup', MasterShapeGroupSchema);
    ColorTable = myDB.model('tbl_Master_Color', ColorSchema);
    StoneColorTable = myDB.model('tbl_Master_StoneColor', StoneColorSchema);
    StoneCutTable = myDB.model('tbl_Master_Cut', StoneCutSchema);
    StoneClarityTable = myDB.model('tbl_Master_Clarity', StoneClaritySchema);
    CuletTable = myDB.model('tbl_Master_Culet', CuletSchema);
    GridleTable = myDB.model('tbl_Master_Gridle', GridleSchema);
    // VendorTable = myDB.model('tbl_Master_Vendor', VendorSchema);
    settingType = myDB.model('tbl_Master_SettingType', settingTypeSchema);
    CurrencyExchangeTable = myDB.model('tbl_Currencyexchange', CurrencyExchangeSchema);
    StoneSize = myDB.model('tbl_Master_StoneSize', StoneSizeSchema);
    return;
}

/** RepairCategorie Models **/
module.exports.RepairCategorie = function () {
    return RepairCategorieTable;
}
module.exports.getRepairCategories = (args = {}, projection = {}) => {
    return new Promise((resolve) => {

        RepairCategorieTable.find(args, projection, async function (err, result) {
            if (result) {

                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
/** RepairCategorie Models **/
/** EComCategorie Models **/
module.exports.EComCategorie = function () {
    return EComCategorieTable;
}
module.exports.getEComCategories = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        EComCategorieTable.find(args, projection, async function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
module.exports.getEComCategorie = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        EComCategorieTable.findOne(args, projection, async function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
/** EComCategorie Models **/

/** Voucher Models **/
module.exports.Voucher = function () {
    return VoucherTable;
}
module.exports.getVoucher = (args = { group: "Purchase order" }, projection = {}) => {
    return new Promise((resolve) => {
        args.is_delete = 0;
        VoucherTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.getVouchers = (args = { group: "Purchase order" }) => {
    return new Promise((resolve) => {
        args.is_delete = 0;
        VoucherTable.find(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.generateVoucherNumber = (args, date_to_compare) => {
    return new Promise((resolve) => {
        var filter = {
            group: args?.group,
            locations: args?.location_id,
            Status: "1",
            is_delete: 0,
        };
        var projection = { _id: 1, Configuration: 1, name: 1, code: 1, locations: 1, widthStartNumber: 1, prefillWithZero: 1 };
        VoucherTable.findOne(filter, projection, async function (err, result) {
            if (result) {
                var res = [];
                var date_value = 0;
                forEachAsync(result.Configuration, async (element) => {
                    element.location = result.locations[0];
                    if (date_value) {
                        if (element.conf_date <= date_to_compare && element.conf_date >= date_value) {
                            res = element;
                            date_value = element.conf_date;
                        }
                    } else {
                        res = element;
                        date_value = element.conf_date;
                    }
                    return res;
                }).then(() => {
                    res = {
                        config_id: res.id,
                        name: result.name,
                        code: result.code,
                        ...res,
                        id: result.id,
                        widthStartNumber: parseInt(result.widthStartNumber),
                        prefillWithZero: parseInt(result.prefillWithZero),
                    }
                    resolve(res);
                });
            } else {
                resolve(false)
            }
        });
    });
};

module.exports.updateVoucherNumberToUsed = (args) => {
    return new Promise((resolve) => {
        var filter = {
            '_id': args.id,
            'Configuration.id': args.config_id,
        };

        var data = {
            '$inc': {
                'Configuration.$.conf_updated_no': 1,
            }
        };

        VoucherTable.updateOne(filter, data, async function (err, result) {
            if (result) {
                resolve(true);
            }
        });
    });
};
/** End Voucher Models **/

/** Item Models **/
module.exports.Item = function () {
    return ItemTable;
}

module.exports.getItem = (args = {}) => {
    return new Promise((resolve) => {
        ItemTable.findOne(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
module.exports.getItems = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        ItemTable.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
/** End Item Models **/
/** Collection Models **/
module.exports.Collection = function () {
    return CollectionTable;
}
module.exports.getCollection = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        CollectionTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
module.exports.getCollections = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        CollectionTable.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

/** Metal Models **/
module.exports.Metal = function () {
    return MetalTable;
}

module.exports.getMetal = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        MetalTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
module.exports.getMetals = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        MetalTable.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
/** End Metal Models **/

/** Size Models **/
module.exports.Size = function () {
    return SizeTable;
}

module.exports.getSize = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        SizeTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getSizes = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        SizeTable.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
/** End Size Models **/

/**  SettingType Models **/

module.exports.getSettingTypes = (args = {}) => {
    return new Promise((resolve) => {
        args.is_delete = 0;
        settingType.find(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};
module.exports.getSettingType = (args = {}) => {
    return new Promise((resolve) => {
        settingType.findOne(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};
/** End SettingType Models **/


/** Stone Models **/
module.exports.Stone = function () {
    return StoneTable;
}

module.exports.getStone = (args = {}, projection = {}) => {
    return new Promise((resolve) => {

        StoneTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getStones = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        StoneTable.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
/** End Stone Models **/
/** Stone Group Models **/
module.exports.StoneGroup = function () {
    return StoneGroupTable;
}
module.exports.getStoneGroup = (args = {}) => {
    return new Promise((resolve) => {
        StoneGroupTable.findOne(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
module.exports.getStoneGroups = (args = {}) => {
    return new Promise((resolve) => {
        args.is_delete = 0;
        StoneGroupTable.find(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};
/** End Stone Group Models **/
/** Product Models **/
module.exports.Product = function () {
    return ProductTable;
}

module.exports.getProducts = (args = {}, projection = {}, Options) => {
    return new Promise((resolve) => {
        ProductTable.find(args, projection, Options, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getProduct = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        ProductTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
/** End Product Models **/
/** PoOrder Models **/
module.exports.PoOrder = function () {
    return PoOrderTable;
}

module.exports.getPoOrder = (args = {}, projection = {}, Options) => {
    return new Promise((resolve) => {
        PoOrderTable.findOne(args, projection, Options, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.updatePoOrder = (args = {}, data) => {
    return new Promise((resolve) => {
        var updatedata = {
            '$set': data
        };
        PoOrderTable.updateOne(args, updatedata, function (err, result) {
            if (result) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

/** End PoOrder Models **/
/** Product Models **/
module.exports.PoProduct = function () {
    return PoProductTable;
}

module.exports.getPoProducts = (args = {}, projection = {}, Options = {}) => {
    return new Promise((resolve) => {
        PoProductTable.find(args, projection, Options, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getPoProduct = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        PoProductTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};


module.exports.updatePoProduct = (args = {}, data) => {
    return new Promise((resolve) => {
        var updatedata = {
            '$set': data
        };
        PoProductTable.updateOne(args, updatedata, function (err, result) {
            if (result) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

module.exports.createPoProduct = (args = {}) => {
    return new Promise((resolve) => {
        PoProductTable.create(args, function (err, result) {
            if (result) {
                resolve(result?._id);
            } else {
                resolve(false);
            }
        });
    });
}
/** End Product Models **/


/** LocationZone Models **/
/** Sourav Start */
module.exports.LocationZone = function () {
    return LocationZoneTable;
}

module.exports.getLocationZone = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        LocationZoneTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getLocation = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        LocationTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getLocations = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        LocationTable.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getLocationZones = (args = {}, projection = {}) => {
    return new Promise((resolve) => {

        LocationZoneTable.find(args, projection, function (err, result) {
            if (result) {

                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

/** End Zone Models **/


/** Color Models **/
module.exports.Color = function () {
    return ColorTable;
}

module.exports.getColor = (args = {}) => {
    return new Promise((resolve) => {
        ColorTable.findOne(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
module.exports.getColors = (args = {}) => {
    return new Promise((resolve) => {
        args.is_delete = 0;
        ColorTable.find(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};
/** End Color Models **/
module.exports.getPolish = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        PolishTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getSymmetry = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        SymmetryTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getFluoresence = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        FluoresenceTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
module.exports.getShape = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        MasterShapeTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getShapes = (arg = {}, projection = {}) => {
    return new Promise((resolve) => {
        MasterShapeTable.find(arg, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};


module.exports.getShapeGroup = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        MasterShapeGroupTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getShapeGroups = (arg, projection) => {
    return new Promise((resolve) => {
        MasterShapeGroupTable.find(arg, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};


module.exports.getColorOne = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        StoneColorTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
module.exports.getStoneColor = (arg = {}, projection = {}) => {
    return new Promise((resolve) => {
        StoneColorTable.find(arg, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
module.exports.getCutOne = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        StoneCutTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getStoneCut = (arg = {}, projection = {}) => {
    return new Promise((resolve) => {
        StoneCutTable.find(arg, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getClarityOne = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        StoneClarityTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
module.exports.getStoneClarity = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        StoneClarityTable.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
module.exports.getStonePolish = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        PolishTable.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getStoneSymmetry = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        SymmetryTable.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getStoneFluoresence = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        FluoresenceTable.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getGridle = (args = {}, projection = {}) => {
    return new Promise((resolve) => {

        GridleTable.findOne(args, projection, function (err, result) {
            if (result) {

                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
module.exports.getCulet = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        CuletTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getStoneSizeOne = (args = {}, pageOptions = {}) => {
    return new Promise((resolve) => {
        StoneSize.findOne(args, {}, pageOptions, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};



/** Start Voucher Models **/

module.exports.getVouchers = (args = { group: "Purchase order" }) => {
    return new Promise((resolve) => {
        args.is_delete = 0;
        VoucherTable.find(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};


/** Item Models **/
module.exports.CurrencyExchange = function () {
    return CurrencyExchangeTable;
}

module.exports.getCurrencyExchange = (args = {}) => {
    return new Promise((resolve) => {
        CurrencyExchangeTable.findOne(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve(false);
            }
        }).lean();
    });
};
/** End Item Models **/


/** Product Image Start  */
module.exports.getProductImagesList = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        ProductImageTable.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });


}

/** */

// inv product qty update
module.exports.updateProductQty = (args = {}, projection = { type: 1, sold_qty_list: 1, po_QTY: 1, po_QTY_noChange: 1, sold_qty: 1, sold_status: 1 }) => {
    return new Promise(async (resolve) => {
        let filter = {
            _id: args?.product_id
        }
        await PoProductTable.findOne(filter, projection).lean().then(async (result) => {
            if (result) {
                if (args?.work == true) {
                    if (result?.po_QTY < result?.po_QTY_noChange) {
                        let update_qty = parseInt(result?.po_QTY) + parseInt(args?.qty);
                        if (result?.sold_status) {
                            let qty = result?.sold_qty - parseInt(args?.qty);
                            await PoProductTable.updateOne(filter, { '$set': { sold_qty: qty } });
                            if (qty == 0 && result?.type != 'POS_Order') {
                                await PoProductTable.updateOne(filter, { '$unset': { sold_status: 1, sold_qty: 1, sold_qty_list: 1 } })
                            }
                        }
                        let updated_result = await PoProductTable.updateOne(filter, { '$set': { po_QTY: update_qty } })
                        if (updated_result) {
                            resolve(true);
                        } else {
                            resolve(false)
                        }
                    } else {
                        resolve(false)
                    }
                } else {
                    if (result?.po_QTY != 0) {
                        let update_qty = parseInt(result?.po_QTY) - parseInt(args?.qty);
                        if (result?.sold_status) {
                            let qty = result?.sold_qty + parseInt(args?.qty);
                            await PoProductTable.updateOne(filter, { '$set': { sold_qty: qty } });
                        } else if (!result?.sold_status) {
                            await PoProductTable.updateOne(filter, { '$set': { sold_status: 'sold', sold_qty: parseInt(args?.qty) } });
                        }
                        let updated_result = await PoProductTable.updateOne(filter, { '$set': { po_QTY: update_qty } })
                        if (updated_result) {
                            resolve(true);
                        } else {
                            resolve(false)
                        }
                    } else {
                        resolve(false)
                    }
                }
            } else {
                resolve(false)
            }
        })
    });
}
module.exports.updateSoldQty = (args = {}) => {
    return new Promise(async (resolve) => {
        new commonModel(ORG_DB);
        let filter = {
            _id: args?.product_id
        }
        await PoProductTable.findOne(filter).lean().then(async (result) => {
            if (result) {
                if (args?.is_delete == 0) {
                    let updated_result;
                    if (!result?.sold_qty_list) {
                        let sold_qty_list = [];
                        let data = {
                            Qty: parseInt(args?.qty),
                            cart_id: args?.cart_id,
                            customer: await commonModel.getCustomer({ _id: args?.customer_id }).then((customer) => customer?.fname && customer?.lname ? customer?.fname + " " + customer?.lname : ""),
                            sales_person: await commonModel.getSalesPerson({ _id: args?.sales_person_id ? args?.sales_person_id : SALES_PERSON_ID }).then((sales_person_data) => sales_person_data ? sales_person_data?.name : "")
                        }
                        sold_qty_list.push(data);
                        updated_result = await PoProductTable.updateOne(filter, { '$set': { sold_qty_list: sold_qty_list } })
                    } else if (result?.sold_qty_list) {
                        let data = {
                            Qty: parseInt(args?.qty),
                            cart_id: args?.cart_id,
                            customer: await commonModel.getCustomer({ _id: args?.customer_id }).then((customer) => customer?.fname && customer?.lname ? customer?.fname + " " + customer?.lname : ""),
                            sales_person: await commonModel.getSalesPerson({ _id: args?.sales_person_id ? args?.sales_person_id : SALES_PERSON_ID }).then((sales_person_data) => sales_person_data ? sales_person_data?.name : "")
                        }
                        result?.sold_qty_list.push(data);
                        updated_result = await PoProductTable.updateOne(filter, { '$set': { sold_qty_list: result?.sold_qty_list } })

                    }
                    if (updated_result) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } else if (args?.is_delete == 1) {

                    let updated_result;
                    if (result?.sold_qty_list) {
                        let index;
                        await forEachAsync(result?.sold_qty_list, async (element, key) => {
                            if (element?.cart_id == args?.cart_id) {
                                index = key;
                            }
                        })
                        result?.sold_qty_list.splice(index, index);
                        updated_result = await PoProductTable.updateOne(filter, { '$set': { sold_qty_list: result?.sold_qty_list } })
                        if (updated_result) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    } else {
                        resolve(false);
                    }
                }
            } else {
                resolve(false);
            }
        })
    })
}


module.exports.productCount = (args = {}) => {
    return new Promise(async (resolve) => {
        await ProductTable.aggregate([
            { $match: args },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: 1
                    }
                }
            }
        ]).then((result) => {
            if (result) {
                resolve(result[0]?.total)
            } else {
                resolve(0)
            }
        })
    })
}

module.exports.poProductCount = (args = {}) => {
    return new Promise(async (resolve) => {
        await PoProductTable.aggregate([
            { $match: args },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: 1
                    }
                }
            }
        ]).then((result) => {
            if (result) {
                resolve(result[0]?.total)
            } else {
                resolve(0)
            }
        })
    })
}