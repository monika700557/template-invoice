const crypto = require('crypto');
var OrganizationUsers = require('./OrganizationUsers.model');
var mongoose = require('mongoose');
const forEachAsync = require('foreachasync').forEachAsync;
const dateHelper = require('../../Helper/DateHelper.js');
// Setup schema
var Schema = mongoose.Schema({}, {
    collection: 'tbl_organization',
    strict: false,
});
var CornJobRequestSchema = mongoose.Schema({}, {
    collection: 'tbl_CornJobRequest',
    strict: false,
    timestamps: true
});
const LanguagesFlagSchema = mongoose.Schema({}, {
    collection: 'tbl_Languages_flags',
    strict: false,
});

var CountrySchema = mongoose.Schema({}, {
    collection: 'tbl_country',
    strict: false,
});

var CurrencyFlagSchema = mongoose.Schema({}, {
    collection: 'tbl_Currency_flags',
    strict: false,
});
var emailTypesSchema = mongoose.Schema({}, {
    collection: 'tbl_email_types',
    strict: false,
});
var PaymentMethodsSchema = mongoose.Schema({}, {
    collection: 'Payment_methods',
    strict: false,
});
const domainsSchema = mongoose.Schema({}, {
    collection: 'tbl_domains',
    strict: false,
    timestamps: true,
});

const credentialsSchema = mongoose.Schema({}, {
    collection: 'tbl_ApplicationDetails',
    strict: false,
    timestamps: true
});
const LogisticSchema = mongoose.Schema({}, {
    collection: 'tbl_Logisic',
    strict: false,
});

const myDB = mongoose.connection.useDb('GisAdminDb');
var table = module.exports = myDB.model('tbl_organization', Schema);
var Countrytable = module.exports = myDB.model('tbl_country', CountrySchema);
var cornJobRequest = module.exports = myDB.model('tbl_CornJobRequest', CornJobRequestSchema);
var LanguagesFlagTable = module.exports = myDB.model('tbl_Languages_flags', LanguagesFlagSchema);
var CurrencyFlagTable = module.exports = myDB.model('tbl_Currency_flags', CurrencyFlagSchema);
var emailTypesTable = module.exports = myDB.model('tbl_email_types', emailTypesSchema);
var PaymentMethodsTable = module.exports = myDB.model('Payment_methods', PaymentMethodsSchema);
var domainstable = module.exports = myDB.model('tbl_domains', domainsSchema);
var credentialsTable = module.exports = myDB.model('tbl_ApplicationDetails', credentialsSchema);
var LogisticTable = module.exports = myDB.model('tbl_Logisic', LogisticSchema);

function getOne(args = {}, projection = {}) {
    return new Promise((resolve) => {
        table.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
}
module.exports.getOne = getOne;
module.exports.Logistic = function () {
    return LogisticTable;
}

module.exports.updateOrgDetails = (args = {}, data = {}) => {
    return new Promise(async (resolve) => {
        let updateData = {
            '$set': data
        }
        table.updateOne(args, updateData, function (err, result) {
            if (result?.modifiedCount >= 1) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    })
}

module.exports.getUserDetails = (args = {}, projection = {}) => {
    return new Promise(async (resolve) => {
        let org = await getOne(args, projection);
        if (org) {
            resolve(org);
        } else {
            let user = await OrganizationUsers.getOne(args, projection);
            if (user) {
                resolve(user);
            } else {
                resolve();
            }

        }
    });
};

module.exports.checkloginToken = function (login_token) {
    return new Promise(async (resolve) => {
        var result = await this.getUserByArgs({ 'login_token': login_token });
        resolve(result);
    });
}


function getUserByArgs(args) {
    return new Promise(async (resolve) => {
        var org, orgUser = await OrganizationUsers.getOne(args);
        if (orgUser) {
            org = await getOne({ '_id': orgUser.tbl_organization_id });
        } else {
            org = await getOne(args);
        }

        if (org) {
            resolve({
                'database_name': org.database_name,
                'first_name': orgUser?.first_name || org.first_name,
                'last_name': orgUser?.last_name || org.last_name,
                'status': orgUser?.status || org.status,
                'admin': {
                    'id': orgUser?.id || org.id,
                    'name': orgUser?.first_name || org.first_name,
                    'type': org?.id ? 'organisation' : 'user',
                    'organisation_id': orgUser?.tbl_organization_id || org.id,
                    'organization_name': org.organization,
                    'upload_folder': org.upload_folder,
                    'timezones': org.timezones,
                    'storeName': org.storeName,
                    'language_list': org.language_list,
                    'ip_address': orgUser?.ip_address,
                    'user_type': orgUser?.type,
                    'date_format': date_format_change(org.date_format),
                    'price_format': {
                        'currency': org?.Default_currency || "USD",
                        'show_amount_in': org.show_amount,
                        'decimal_point': org.decimal_point,
                        'thousand_separator': org.thousand_separator,
                    },
                    'Default_currency': org?.Default_currency,
                    'All_Currency': org.All_Currency
                }
            });
        } else {
            resolve(false)
        }
    });
}
module.exports.getUserByArgs = getUserByArgs;
function date_format_change(date_format) {
    var response;
    if (date_format == "d/m/Y") {
        response = "DD/MM/YYYY";
    } else if (date_format == 'Y/m/d') {
        response = "YYYY/MM/DD";
    } else if (date_format == 'm/d/Y') {
        response = "MM/DD/YYYY";
    } else if (date_format == 'm/Y/d') {
        response = "MM/YYYY/DD";
    }
    return response;
}



module.exports.CornJobRequest = (data) => {
    return new Promise((resolve) => {
        let dataOne = cornJobRequest.create(data).then((result) => result.id);
        resolve(dataOne);
    });

}

module.exports.CornJobRequestList = (arg = {}) => {
    return new Promise((resolve) => {
        // let dataOne =   cornJobRequest.find(arg).then((result) => result);
        // resolve(dataOne);


        cornJobRequest.find(arg, { key: 0 }).lean().then(async (result) => {
            if (result) {
                forEachAsync(result, async (element) => {
                    element.createdAt = dateHelper.getDateInOrganisationFormat(element.createdAt);
                    element.updatedAt = dateHelper.getDateInOrganisationFormat(element.updatedAt);
                    element.User_name = "";
                    if (element?.User_id) {
                        element.User_name = await getUserByArgs({ _id: element?.User_id }).then((User) => {
                            return User?.first_name;
                        });

                    }
                }).then(function () {
                    resolve(result);
                });
            } else {
                resolve();
            }

        });
    });

}
module.exports.getLanguageWithflag = (args = {}, projection = {}, options = {}) => {
    return new Promise((resolve) => {
        LanguagesFlagTable.findOne(args, projection, options, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};
module.exports.getLanguages = (args = {}, projection = {}, options = {}) => {
    return new Promise((resolve) => {
        args.status = 1;
        LanguagesFlagTable.find(args, projection, options, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};
module.exports.getLanguageWithflags = () => {
    return new Promise((resolve) => {
        // args.is_delete = 0;
        let args = { status: 1 };
        let filter = {
            'name': 1
        }
        LanguagesFlagTable.find(args, filter, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};


module.exports.getCountry = () => {
    return new Promise((resolve) => {
        Countrytable.find({}, {}, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getFindOne = (args) => {
    return new Promise((resolve) => {
        Countrytable.findOne(args, {}, function (err, result) {
            if (result) {
                resolve(result.name);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getOneCountry = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        Countrytable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getCountryWithFilter = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        Countrytable.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

// org module functions

module.exports.viewData = async (args) => {
    return new Promise(async (resolve) => {
        let org = await module.exports.getOne(args);
        if (org) {
            let country = await module.exports.getOneCountry({ id: org?.country })
            let response = {
                brand_logo: org?.brand_logo ? org?.brand_logo : "",
                organization: org?.organization ? org?.organization : "",
                name: org?.first_name + " " + org?.last_name,
                website: org?.website ? org?.website : "",
                address: org?.address ? org?.address : "",
                state: org?.state ? org?.state : "",
                city: org?.city ? org?.city : "",
                country: org?.country ? org?.country : "",
                country_name: country?.name ? country?.name : "",
                zipcode: org?.zipcode ? org?.zipcode : "",
                taxid: org?.taxid ? org?.taxid : "",
                email: org?.email ? org?.email : "",
                Default_currency: org?.Default_currency?.length ? org?.Default_currency : "",
                decimal_point: org?.decimal_point ? org?.decimal_point : "",
                inventory: org?.inventory ? org?.inventory : "",
                show_amount: org?.show_amount ? org?.show_amount : "",
                thousand_separator: org?.thousand_separator ? org?.thousand_separator : "",
                timezones: org?.timezones ? org?.timezones : "",
                image_type: org?.image_type ? org?.image_type : "",
                date_format: org?.date_format ? org?.date_format : "",
                inactive_hour: org?.inactive_hour ? org?.inactive_hour : "",
                mobilesplashScreen: org?.mobilesplashScreen ? org?.mobilesplashScreen : []
            }
            if (org?.contacts && org?.contacts?.length) {
                response.contacts = org?.contacts;
            } else {
                let contacts = [{ icon: 1, code: org?.phone_code ? org?.phone_code : "", no: org?.phone ? org?.phone : "" }];
                response.contacts = contacts;
            }
            resolve(response);
        } else {
            resolve();
        }
    })
}

module.exports.editOrgDetail = async (args = {}) => {
    return new Promise(async (resolve) => {
        let data = args?.data;
        let updateData = {
            brand_logo: data?.brand_logo,
            organization: data?.organization,
            website: data?.website,
            address: data?.address,
            state: data?.state,
            city: data?.city,
            country: data?.country,
            zipcode: data?.zipcode,
            taxid: data?.taxid,
            email: data?.email,
            Default_currency: data?.Default_currency,
            decimal_point: data?.decimal_point,
            show_amount: data?.show_amount,
            thousand_separator: data?.thousand_separator,
            inventory: data?.inventory,
            wallpaper_image: data?.wallpaper_image,
            timezones: data?.timezones,
            image_type: data?.image_type,
            date_format: data?.date_format,
            inactive_hour: data?.inactive_hour,
            contacts: data?.contacts,
            mobilesplashScreen: data?.mobilesplashScreen
        }
        let result = await module.exports.updateOrgDetails({ _id: ORG_ID }, updateData);
        if (result) {
            resolve(true);
        } else {
            resolve(false);
        }
    })
}

// Update Profile Update 

module.exports.UpdateAccessToken = async (args = {}, data = {}) => {

    return new Promise(async (resolve) => {
        let org = await module.exports.updateOrgDetails(args, data);
        if (org) {
            resolve(org);
        } else {
            let user = await OrganizationUsers.updateUser(args, data);
            if (user) {
                resolve(user);
            } else {
                resolve();
            }

        }
    });
}

module.exports.getflag = (args, projection = {}, options = {}) => {
    return new Promise((resolve) => {
        CurrencyFlagTable.findOne(args, projection, options, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getflags = (args = {}, projection = {}, options = {}) => {
    return new Promise((resolve) => {
        CurrencyFlagTable.find(args, projection, options, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        })
    });
};


module.exports.updateCurrency = (args = {}, data) => {
    return new Promise((resolve) => {
        var updateData = {
            '$set': data

        };
        CurrencyFlagTable.updateOne(args, updateData, function (err, result) {
            if (result.modifiedCount >= 1) {
                resolve(true);
            }

        });
    });
}



module.exports.getEmailTypes = (args = {}, projection = {}) => {
    return new Promise(async (resolve) => {
        emailTypesTable.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve([]);
            }
        }).lean()
    });
}
module.exports.getEmailTypeOne = async (args = {}, projection = {}) => {
    return new Promise(async (resolve) => {
        emailTypesTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve()
            }
        })
    })
}
module.exports.randomString = () => {
    return new Promise(async (resolve) => {
        let length = 60;
        let result = '';
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        resolve(result);
    })
}


module.exports.getPaymentMethods = async (args = {}, projection = {}) => {
    return new Promise(async (resolve) => {
        PaymentMethodsTable.find(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve()
            }
        })
    })
}
module.exports.getPaymentMethod = async (args = {}, projection = {}) => {
    return new Promise(async (resolve) => {
        PaymentMethodsTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve()
            }
        })
    })
}


//  Domains manage table    
module.exports.insertDomains = (args = {}) => {
    return new Promise((resolve) => {
        domainstable.create(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        })
    });
};
const DomainCreate = (args = {}) => {
    return new Promise((resolve) => {
        domainstable.create(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        })
    });
};

module.exports.getDomain = (args = {}, projection = {}) => {
    return new Promise((resolve) => {
        domainstable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getDomains = (args = {}, projection = {}, options = {}) => {
    return new Promise((resolve) => {
        domainstable.find(args, projection, options, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

const CheckDomains = (args = {}, projection = {}, options = {}) => {
    return new Promise((resolve) => {
        domainstable.find(args, projection, options, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.updateDomains = async (args = {}, data = {}) => {
    return new Promise(async (resolve) => {
        var updateData = {
            '$set': data
        };
        domainstable.updateOne(args, updateData, function (err, result) {
            if (result.modifiedCount >= 1) {
                resolve(true);
            } else {
                resolve(true);
            }

        });
    })
}

module.exports.updateManyxDomains = async (args = {}, data = {}) => {
    return new Promise(async (resolve) => {
        var updateData = {
            '$set': data
        };
        domainstable.updateMany(args, updateData, function (err, result) {
            if (result.modifiedCount >= 1) {
                resolve(true);
            } else {
                resolve(true);
            }

        });
    })
}

module.exports.updateManyDomains = async (args = {}, data = {}) => {
    return new Promise(async (resolve) => {
        var updateData = {
            '$set': data
        };
        domainstable.updateOne(args, updateData, function (err, result) {
            if (result.modifiedCount >= 1) {
                resolve(true);
            } else {
                resolve(true);
            }

        });
    })
}
const deleteDomain = (args) => {
    return new Promise((resolve) => {
        domainstable.deleteMany(args, function (err, result) {
            if (result) {
                resolve(true);
            }

        });
    });
}

module.exports.deleteDomainbyID = (args = {}) => {
    return new Promise((resolve) => {
        domainstable.deleteOne(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
}


module.exports.deleteDomain = deleteDomain
module.exports.deleteDomainbyID = (args = {}) => {
    return new Promise((resolve) => {
        domainstable.deleteOne(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
}


function slugify(str) {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}
module.exports.createLocationSubdomain = async (locationName, location_id, updateCall = true) => {
    let name = "";
    const slugifyOut = slugify(locationName?.toLowerCase()?.trim());
    let newSubDomain = `${slugifyOut}.${process.env.LIVEDOMAIN}`;
    try {
        name = newSubDomain?.toLowerCase()?.trim();
        let filter = { name: name };
        let DomainOne = await CheckDomains(filter);
        if (DomainOne?.length && updateCall) {
            // throw new Error('Domain Name allready exit! Link to Another Store'); 
            let newSubDomain = `${slugifyOut}-${DomainOne?.length + 1}.${process.env.LIVEDOMAIN}`;

            name = newSubDomain?.toLowerCase()?.trim();
        } else {
            await deleteDomain({ location_id: location_id?.toString(), name: name });
        }

        let insertDomains = {
            name: name,
            org_id: ORG_ID,
            type: updateCall ? 1 : 0,
            is_delete: updateCall ? 0 : 1,
            is_varified: 1,
            location_id: location_id,
            DomanType: 2,
        }
        let insertDomain = await DomainCreate(insertDomains);
        return insertDomain;
    } catch (error) {

        return error.message;

    }
}
module.exports.genratePassword = (password, password_salt) => {
    return new Promise(async (resolve) => {
        let hash = crypto.pbkdf2Sync(password, password_salt, 1000, 64, 'sha512').toString("base64");
        resolve(hash);
    })
}


// credentials tabel functions

module.exports.getcredentials = (args = {}, projection = {}, options = {}) => {
    return new Promise(async (resolve) => {
        credentialsTable.find(args, projection, options).lean().then((result) => {
            if (result) {
                resolve(result);
            } else {
                resolve([]);
            }
        })
    })
}

module.exports.getOnecredentials = (args = {}, projection = {}, options = {}) => {
    return new Promise(async (resolve) => {
        credentialsTable.findOne(args, projection, options).then((result) => {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        })
    })
}

module.exports.updateCredentials = async (args = {}, data = {}) => {
    return new Promise(async (resolve) => {
        var updateData = {
            '$set': data
        };
        credentialsTable.updateOne(args, updateData).then((result) => {
            if (result.modifiedCount >= 1) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    })
}

module.exports.getOrgUsersBoth = async (args = {}, projection = {}) => {
    var orgUser = await OrganizationUsers.getOne(args, projection);
    if (!orgUser) {
        orgUser = await getOne(args, projection);
    }
    return orgUser
}
