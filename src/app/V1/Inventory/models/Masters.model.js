const forEachAsync = require('foreachasync').forEachAsync;
const mongoose = require('mongoose');

// Setup schema 
const VoucherSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_VoucherType',
    strict: false,
});
const StoneGroupSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_StoneGroup',
    strict: false,
    timestamps: true,
});
const StoneSizeSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_StoneSize',
    strict: false,
    timestamps: true,
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

const ColorSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_Color',
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

const LocationZoneSchema = mongoose.Schema({}, {
    collection: 'tbl_location_zone',
    strict: false,
});
const ProductSchema = mongoose.Schema({}, {
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

const CronJobRequestSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_CronJobRequest',
    timestamps: true,
    strict: false
});

const VendorSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_Vendor',
    timestamps: true,
    strict: false
});
const SettingTypeSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_SettingType',
    timestamps: true,
    strict: false
});


const NotificationSchema = mongoose.Schema({}, {
    collection: 'tbl_notifications',
    strict: false,
    timestamps: true,
});

NotificationSchema.pre('save', function (next) {
    this.set({ 'user_actions.created_by': user().id, 'user_actions.updated_by': user().id });
    next();
});

NotificationSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function (next) {
    this.set({ 'user_actions.updated_by': user().id });
    next();
});


const POPUExcelImportLogs = mongoose.Schema({}, {
    collection: 'tbl_po_pu_excelImportLogs',
    strict: false,
    timestamps: true,
});

POPUExcelImportLogs.pre('save', function (next) {
    this.set({ 'user_actions.created_by': user().id, 'user_actions.updated_by': user().id });
    next();
});

POPUExcelImportLogs.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function (next) {
    this.set({ 'user_actions.updated_by': user().id });
    next();
});

const LocationSchema = mongoose.Schema({}, {
    collection: 'tbl_location',
    strict: false,
    timestamps: true,
});

const CustomerSchema = mongoose.Schema({}, {
    collection: 'tbl_customers',
    strict: false,
    timestamps: true,
});

const StyleSchema = mongoose.Schema({}, {
    collection: 'tbl_Master_Style',
    strict: false,
    timestamps: true,
});

var myDB;
var StyleTable, SymmetryTable, ProductTable, SettingType, StoneGroupTable, StoneSizTable, MasterShapeGroupTable, PolishTable, FluoresenceTable, GridleTable, CuletTable, CronJobRequest, VoucherTable, VendorTable, ItemTable, CollectionTable, MetalTable, SizeTable, StoneTable, LocationTable, LocationZoneTable, MasterShapeTable, StoneColorTable, StoneClarityTable, StoneCutTable, NotificationTable, POPUImportLogs, CustomerTable, ColorTable;

module.exports = function (DB) {
    myDB = mongoose.connection.useDb(DB);
    StyleTable = myDB.model('tbl_Master_Style', StyleSchema);
    CronJobRequest = myDB.model('tbl_Master_CronJobRequest', CronJobRequestSchema);
    VoucherTable = myDB.model('tbl_Master_VoucherType', VoucherSchema);
    ItemTable = myDB.model('tbl_Master_Item', ItemSchema);
    CollectionTable = myDB.model('tbl_Master_Collection', CollectionSchema);
    MetalTable = myDB.model('tbl_Master_Metal', MetalSchema);
    SizeTable = myDB.model('tbl_Master_ItemSize', SizeSchema);
    StoneTable = myDB.model('tbl_Master_Stone', StoneSchema);
    LocationZoneTable = myDB.model('tbl_location_zone', LocationZoneSchema);
    ProductTable = myDB.model('tbl_products', ProductSchema);
    SymmetryTable = myDB.model('tbl_Symmetry', SymmetrySchema);
    FluoresenceTable = myDB.model('tbl_Fluoresence', FluoresenceSchema);
    PolishTable = myDB.model('tbl_Polish', PolishSchema);
    MasterShapeTable = myDB.model('tbl_Master_Shape', MasterShapeSchema);
    MasterShapeGroupTable = myDB.model('tbl_Master_ShapeGroup', MasterShapeGroupSchema);
    StoneColorTable = myDB.model('tbl_Master_StoneColor', StoneColorSchema);
    StoneCutTable = myDB.model('tbl_Master_Cut', StoneCutSchema);
    StoneClarityTable = myDB.model('tbl_Master_Clarity', StoneClaritySchema);
    CuletTable = myDB.model('tbl_Master_Culet', CuletSchema);
    GridleTable = myDB.model('tbl_Master_Gridle', GridleSchema);
    VendorTable = myDB.model('tbl_Master_Vendor', VendorSchema);
    SettingType = myDB.model('tbl_Master_SettingType', SettingTypeSchema);
    NotificationTable = myDB.model('tbl_notifications', NotificationSchema);
    StoneGroupTable = myDB.model('tbl_Master_StoneGroup', StoneGroupSchema);
    StoneSizTable = myDB.model('tbl_Master_StoneSize', StoneSizeSchema);
    POPUImportLogs = myDB.model('tbl_po_pu_excelImportLogs', POPUExcelImportLogs);
    LocationTable = myDB.model('tbl_location', LocationSchema);
    CustomerTable = myDB.model('tbl_customers', CustomerSchema);
    ColorTable = myDB.model('tbl_Master_Color', ColorSchema);

    return;
}

module.exports.Style = function () {
    return StyleTable;
}

module.exports.ProductGet = function () {
    return ProductTable;
}
// vandor mdoel



module.exports.Vendor = function () {
    return VendorTable;
}

module.exports.getVendor = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        VendorTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};
module.exports.getVendors = (args = {}, projection = {}, Options) => {
    return new Promise((resolve) => {
        VendorTable.find(args, projection, Options, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
/** Voucher Models **/
module.exports.Voucher = function () {
    return VoucherTable;
}

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
            _id: args.voucher_id,
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

/** Collection Models **/
module.exports.Collection = function () {
    return CollectionTable;
}

module.exports.getCollection = (args = {}) => {
    return new Promise((resolve) => {
        CollectionTable.findOne(args, function (err, result) {
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

module.exports.getSize = (args = {}) => {
    return new Promise((resolve) => {
        SizeTable.findOne(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getSizes = (args = {}, projection = {}, options = {}) => {
    return new Promise((resolve) => {
        SizeTable.find(args, projection, options, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
/** End Size Models **/

/** Stone  group Models **/
module.exports.StoneGroup = function () {
    return StoneGroupTable;
}

module.exports.createStoneGroup = (args = {}) => {
    return new Promise((resolve) => {
        StoneGroupTable.create(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

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

module.exports.getStonesGroups = (args = {}) => {
    return new Promise((resolve) => {
        StoneGroupTable.find(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
/** End Stone group Models **/

/** Stone Models **/
module.exports.Stone = function () {
    return StoneTable;
}

module.exports.createStone = (args = {}) => {
    return new Promise((resolve) => {
        StoneTable.create(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

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

/** LocationZone Models **/
module.exports.LocationZone = function () {
    return LocationZoneTable;
}

module.exports.getLocationZone = (args = {}) => {
    return new Promise((resolve) => {
        LocationZoneTable.findOne(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getLocationZones = (args = {}) => {
    return new Promise((resolve) => {
        LocationZoneTable.find(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};


module.exports.getPolish = (args = {}) => {
    return new Promise((resolve) => {
        PolishTable.findOne(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getSymmetry = (args = {}) => {
    return new Promise((resolve) => {
        SymmetryTable.findOne(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getFluoresence = (args = {}) => {
    return new Promise((resolve) => {
        FluoresenceTable.findOne(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.createShape = (args = {}) => {
    return new Promise((resolve) => {
        MasterShapeTable.create(args, function (err, result) {
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

module.exports.getShapes = (arg, projection) => {
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

module.exports.createShapeGroup = (args = {}) => {
    return new Promise((resolve) => {
        MasterShapeGroupTable.create(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getShapeGroup = (args = {}) => {
    return new Promise((resolve) => {
        MasterShapeGroupTable.findOne(args, function (err, result) {
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
module.exports.getStoneColor = (arg, projection) => {
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

module.exports.getStoneCut = (arg, projection) => {
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
module.exports.getStoneClarity = (arg, projection) => {
    return new Promise((resolve) => {
        StoneClarityTable.find(arg, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
module.exports.getStonePolish = (arg, projection) => {
    return new Promise((resolve) => {
        PolishTable.find(arg, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getStoneSymmetry = (arg, projection) => {
    return new Promise((resolve) => {
        SymmetryTable.find(arg, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getStoneFluoresence = (arg, projection) => {
    return new Promise((resolve) => {
        FluoresenceTable.find(arg, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getGridle = (args = {}) => {
    return new Promise((resolve) => {
        GridleTable.findOne(args, function (err, result) {
            if (result) {

                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getCulet = (args = {}) => {
    return new Promise((resolve) => {
        CuletTable.findOne(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

/* Import XCEL FILE START */
module.exports.CronJobsRequest = (data) => {
    return new Promise((resolve) => {
        let dataOne = CronJobRequest.create(data).then((result) => result.id);
        resolve(dataOne);
    });

}
module.exports.CronJobsRequestUpdate = (args = {}, data) => {
    return new Promise((resolve) => {

        let updateData = {
            '$set': data
        };
        CronJobRequest.updateOne(args, updateData, function (err, result) {
            if (result.modifiedCount >= 1) {

                resolve(true);
            } else {
                resolve(false);

            }

        });
    });
}




module.exports.insertOneShape = (args = {}) => {
    return new Promise((resolve) => {
        MasterShapeTable.create(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        })
    });
};

module.exports.insertOneShapeGroup = (args = {}) => {
    return new Promise((resolve) => {
        MasterShapeGroupTable.create(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        })
    });
};
module.exports.insertOneColour = (args = {}) => {
    return new Promise((resolve) => {
        StoneColorTable.create(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        })
    });
};

module.exports.insertOneClarity = (args = {}) => {
    return new Promise((resolve) => {
        StoneClarityTable.create(args, function (err, result) {
            if (result) {

                resolve(result);
            } else {
                resolve();
            }
        })
    });
};

module.exports.insertOneCut = (args = {}) => {
    return new Promise((resolve) => {
        StoneCutTable.create(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        })
    });
};
module.exports.insertOneCulet = (args = {}) => {
    return new Promise((resolve) => {
        CuletTable.create(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        })
    });
};
module.exports.insertOneGridle = (args = {}) => {
    return new Promise((resolve) => {
        GridleTable.create(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        })
    });
};

module.exports.insertOneSize = (args = {}) => {
    return new Promise((resolve) => {
        SizeTable.create(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        })
    });
};
module.exports.insertOnePolish = (args = {}) => {
    return new Promise((resolve) => {
        PolishTable.create(args, function (err, result) {
            if (result) {

                resolve(result);
            } else {
                resolve();
            }
        })
    });
};
module.exports.insertOneSymmetry = (args = {}) => {
    return new Promise((resolve) => {
        SymmetryTable.create(args, function (err, result) {
            if (result) {

                resolve(result);
            } else {
                resolve();
            }
        })
    });
};
module.exports.insertOneFluoresence = (args = {}) => {
    return new Promise((resolve) => {
        FluoresenceTable.create(args, function (err, result) {
            if (result) {

                resolve(result);
            } else {
                resolve();
            }
        })
    });
};



/* Import Done */


module.exports.getSettingType = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        SettingType.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.getSettingTypes = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        SettingType.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.createSettingType = (args = {}) => {
    return new Promise((resolve) => {
        SettingType.create(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

/** Gis NotificationTable Models **/
module.exports.getNotification = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        NotificationTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.getNotifications = (args = {}, projection = {}, options = {}) => {
    return new Promise((resolve) => {
        NotificationTable.find(args, projection, options, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.updateNotifications = (args = {}, data = {}) => {
    return new Promise((resolve) => {
        var updateData = { '$set': data };
        NotificationTable.updateOne(args, updateData, function (err, result) {
            if (result.modifiedCount >= 1) {
                resolve(true);
            } else {
                resolve(false);
            }

        });
    });
};
module.exports.createNotifications = (args = {}) => {
    return new Promise((resolve) => {
        NotificationTable.create(args, function (err, result) {
            if (result) {
                resolve(result.id);
            } else {
                resolve();
            }
        })
    });
};


module.exports.updateManyNotifications = (data) => {
    return new Promise((resolve) => {
        var updateData = {
            '$set': data
        };
        NotificationTable.updateMany(updateData, function (err, result) {
            if (result) {
                resolve(true);
            }
        });
    });
}
/** End Gis NotificationTable Models **/

/** Stone  Size Models **/
module.exports.StoneSize = function () {
    return StoneSizTable;
}

module.exports.createStoneSize = (args = {}) => {
    return new Promise((resolve) => {
        StoneSizTable.create(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getStoneSize = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        StoneSizTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getStoneSizes = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        StoneSizTable.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
/** End Stone Size Models **/

/*   START PO PU EXCEL IMPORT  LOGS*/

module.exports.getImportlogs = (args = {}) => {
    return new Promise((resolve) => {
        POPUImportLogs.findOne(args, function (err, result) {
            if (result) {

                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};


module.exports.insertImportlogs = (args = {}) => {
    return new Promise((resolve) => {
        POPUImportLogs.create(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        })
    });
};


module.exports.getImportlogs = (args = {}, projection = {}, options = {}) => {
    return new Promise((resolve) => {
        POPUImportLogs.find(args, projection, options, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};


module.exports.deleteRequestImportlogs = (args) => {
    return new Promise((resolve) => {
        POPUImportLogs.deleteMany(args, function (err, result) {
            if (result) {
                resolve(true);
            }

        });
    });
}


/** start UNiqe Functions **/
module.exports.ExcelMastersGet = (value, typeFunction, dbStones) => {
    return new Promise(async (resolve) => {
        let returnId = '';
        let filter = { is_delete: 0 };
        if (value) {
            var newReg = { $regex: value, $options: 'i' };
            filter['$or'] = [{ name: newReg }, { code: newReg }];
            let result;
            let dynamicFunction = await module.exports[typeFunction];
            if (typeof dynamicFunction === 'function') {
                result = await dynamicFunction(filter);
                // Process the result
            }
            if (result) {
                returnId = result._id.toString();
            }

        } else {
            returnId = dbStones;
        }
        resolve(returnId);
    })
}


module.exports.getLocation = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        LocationTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
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
        });
    });
};

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
/** End Customer Models **/

/* Color Models */
module.exports.tMasterColor = function () {
    return ColorTable;
}

module.exports.getMasterColor = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        ColorTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
/* End Color Models */

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