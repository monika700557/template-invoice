const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({}, {
  collection: 'tbl_Orders',
  strict: false,
  timestamps: true,
});

OrderSchema.pre('save', function (next) {
  this.set({ 'user_actions.created_by': user().id, 'user_actions.updated_by': user().id });
  next();
});

OrderSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
  this.set({ 'user_actions.updated_by': user().id });
  next();
});

var myDB;
var OrderTable;

module.exports = function (DB) {
  myDB = mongoose.connection.useDb(DB);
  OrderTable = myDB.model('tbl_Orders', OrderSchema);
  return OrderTable;
}

/** POS Models **/
module.exports.init = function () {
  return OrderTable;
}

module.exports.updateOrder = (args = {}, data) => {
  return new Promise((resolve) => {
    var updateData = {
      '$set': data
    };

    OrderTable.updateOne(args, updateData, function (err, result) {
      if (result.modifiedCount >= 1) {
        resolve(true);
      }
    });
  });
}
module.exports.addOrder = (args = {}) => {
  return new Promise((resolve) => {
    OrderTable.create(args, function (err, result) {
      if (result) {
        resolve(result);
      } else {
        resolve();
      }
    })
  });
};

module.exports.getOrder = (args = {}, projection = {}) => {
  return new Promise((resolve) => {
    OrderTable.findOne(args, projection, function (err, result) {

      if (result) {
        resolve(result);
      } else {
        resolve(err);
      }
    }).lean();
  });
};

module.exports.getOrders = (args = {}, projection = {}, options = {}) => {
  return new Promise((resolve) => {
    OrderTable.find(args, projection, options, function (err, result) {
      if (result) {
        resolve(result);
      } else {
        resolve();
      }
    }).lean();
  });
};

module.exports.orderTotal = (args = {}) => {
  return new Promise(async (resolve) => {
    let result = await OrderTable.aggregate([
      { $match: args },
      {
        $group: {
          _id: null,
          total: {
            $sum: 1
          }
        }
      }
    ]);
    resolve(result[0]?.total);
  });
};