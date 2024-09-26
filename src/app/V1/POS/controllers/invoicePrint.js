const userData = require("../../../../mock-data/userDataResponse.js");

global.user = () => {
  return userData.user();
};
global.ORG_DB = "test_gis_printout";
global.FOLDER = user().upload_folder;
global.POS_DATE_FORMAT = user().timezones;
global.POS_TIME_ZONE = user().timezones;
const _ = require("underscore");
const fs = require("fs");
const utils = require("util");
const puppeteer = require("puppeteer");
const hb = require("handlebars");
const forEachAsync = require("foreachasync").forEachAsync;
const readFile = utils.promisify(fs.readFile);
const base64 = require("image-to-base64");
const basePath = process.cwd();
global.BASEPATH = basePath + "/constant/";
const priceHelper = require("../../Helper/PriceHelper.js");
const dateHelper = require("../../Helper/DateHelper.js");
const utility = require("../helpers/UtilityHelper.js");
const awsHelper = require("../../Helper/AWSHelper.js");
const masterModelInv = require("../../Inventory/models/Masters.model");
const OrganizationModel = require("../models/Organization.model");
const orderModel = require("../models/Order.model");
const customeOrderModel = require("../models/CustomOrderCart.model");

const posModel = require("../models/POS.model");
const receiveModel = require("../models/receiveModel");
const masterModel = require("../models/Masters.model");
const commonModel = require("../models/Common.model");
const { error } = require("console");

const dynmicTemplate = async (group, default_path) => {
  try {
    let HeaderPath = "";
    let FooterPath = "";
    console.log(group, "group", default_path);
    if (_.contains(default_path, FOLDER)) {
      let store_file = fs.readdirSync(BASEPATH + FOLDER + `/invoices/${group}`);
      let value = store_file.includes("partials");
      if (value) {
        HeaderPath = `${FOLDER}/invoices/${group}/partials/header.html`;
        FooterPath = `${FOLDER}/invoices/${group}/partials/footer.html`;
      }
    } else {
      var default_File = fs.readdirSync(
        BASEPATH + `printTemplat/invoices/${group}`
      );
      let value = default_File.includes("partials");
      if (value) {
        HeaderPath = `printTemplat/invoices/${group}/partials/header.html`;
        FooterPath = `printTemplat/invoices/${group}/partials/footer.html`;
      }
    }

    return {
      HeaderPath: HeaderPath,
      FooterPath: FooterPath,
    };
  } catch (error) {
    console.log(error, "err");
  }
};

exports.customeOrderPrint = async (id) => {
  return new Promise(async (resolve) => {
    new orderModel(ORG_DB);
    new customeOrderModel(ORG_DB);
    new masterModel(ORG_DB);
    new commonModel(ORG_DB);
    new posModel(ORG_DB);
    new masterModelInv(ORG_DB);

    let invoiceHeader = "";
    let invoiceFooter = "";
    await awsHelper.createFolderWithPermissions("./public/reports/");
    let orderId = id; //
    let service_labour = [];
    let servicer_flag = false;
    let product_price;
    let base_amount = 0;
    let printData = {};

    await orderModel
      .init()
      .findOne({ _id: orderId })
      .lean()
      .then(async (result) => {
        // result mean orderList data  from tbl_Orders

        if (result) {
          let printTemplat = await masterModel.getVoucher(
            { _id: result?.voucher_id },
            { print_template: 1, group: 1 }
          );

          if (printTemplat?.print_template) {
            printData.printTemplat = printTemplat?.print_template;
          } else {
            printData.printTemplat = `printTemplat/invoices/${printTemplat?.group}/customeOrder.html`;
          }

          let partials = await dynmicTemplate(
            printTemplat?.group,
            printTemplat?.print_template
          );

          invoiceHeader = readFile(BASEPATH + partials?.HeaderPath, "utf-8");
          invoiceFooter = readFile(BASEPATH + partials?.FooterPath, "utf-8");

          let img = await base64(user().organization_logo).then((res) => {
            return res;
          });
          let QRcode = commonModel.createQR(
            result?.order_no,
            "data:image/jpeg;base64," + img,
            150,
            45
          );

          printData.QRcode = QRcode;
          let customer_Projection = {
            fname: 1,
            mname: 1,
            lname: 1,
            customerid: 1,
            billing_address: 1,
            email: 1,
            contacts: 1,
          };

          printData.customer = await commonModel.getCustomer(
            { _id: result?.customer_id },
            customer_Projection
          );

          let country = await OrganizationModel.getCountry({
            id: result?.customerInfo?.billing_address?.country,
          }).then((country_name) =>
            country_name?.name ? country_name?.name : ""
          );

          let fullAddressComponents = [
            result?.customerInfo?.billing_address?.address,
            result?.customerInfo?.billing_address?.state,
            country,
          ];

          printData.customeraddress = fullAddressComponents
            .filter(
              (component) =>
                component !== null &&
                component !== undefined &&
                component?.trim() != ""
            )
            .join(", ");
          // console.log(result?.customerInfo)

          printData.orderNo = result?.order_no;
          printData.orderDate = dateHelper.getDateInPOSFormat(
            result?.createdAt
          );
          printData.delivery_Date = dateHelper.getDateInPOSFormat(
            result?.delivery_date[0]
          );
          printData.sales_Consultant = await commonModel
            .getSalesPerson({ _id: result?.sales_person_id })
            .then((person) => person?.name);
          printData.taxId = await commonModel
            .getLocation({ _id: result?.location_id })
            .then((tax) => tax?.taxid);
          printData.orderDateTime =
            result?.createdAt.getHours() +
            ":" +
            result?.transaction_date.getMinutes();

          let carData_Projection = {
            service_labour: 1,
            retailprice_Inc: 1,
            diamond_details: 1,
            type: 1,
            "product_details.SKU": 1,
            "product_details.GrossWt": 1,
            "product_details.Matatag": 1,
            "product_details.Description": 1,
            "product_details.main_image": 1,
            "product_details.Size": 1,
            "product_details.retailprice_Inc": 1,

            Qty: 1,
            remark: 1,
            status: 1,
            custom_design: 1,
            "product_details.Stones": 1,
            "product_details.service_labour": 1,
          };

          let cartData = await customeOrderModel.getCustomOrderCarts(
            { _id: { $in: _.uniq(result?.cart_item_ids) } },
            carData_Projection
          );

          if (cartData && cartData.length) {
            let rows = [];
            printData.mixMatch = false;
            printData.custom_order = false;
            await forEachAsync(cartData, async (element) => {
              let rowObj = {};

              if (element?.service_labour) {
                let service_labour_collect = _.map(
                  element?.service_labour?.service_laburelist,
                  "scrviceamount"
                );
                service_labour.push(
                  service_labour_collect.reduce((a, b) => {
                    return a + b;
                  }, 0)
                );
                product_price = element?.service_labour?.product_price;
                servicer_flag = true;
              }

              rowObj.size = await masterModel
                .getSize({ _id: element?.product_details?.Size })
                .then((size) => (size?.name ? size?.name : ""));

              const initialDescription =
                element?.product_details?.Matatag || "Default Description";
              const shortDescription = initialDescription.slice(0, 68);

             console.log(element?.product_details?.Stones)
// try to send to template_data and loop
         const Stone_data  =  element?.product_details?.Stones?.reduce( async (acc,currentValue) =>{
        
            /// this is single loop you have to add / reassign data to stones object befor send
           
            acc[currentValue._id] = currentValue

            acc[currentValue._id].codeName = await masterModel
            .getStone({ _id:  currentValue.stone})
            .then((stone) => (stone?.code ? stone?.code : ""));
        console.log(acc,'curr')
            return acc;
            
            },[])


// just a moment
              // const stoneNameShapeArray = element?.product_details?.Stones?.map(
              //   (stone) =>  
              //     `${stone?.stone_name || ""} ${stone?.shape_name || ""}`
              // );
              const servicesArray =
                element?.services?.map((service) => `• ${service}`) || [];

              if (!rowObj.Description) {
                rowObj.Description = {};
              }

              const metal = await masterModel.getMetal();
              const metalName = metal.name;
              console.log(metalName);

              const  stoneCode =  await masterModel.getStone();
              const codeName = stoneCode.code;
              // console.log(codeName);

              // const stoneName = element?.product_details?.Stones?.map(
              //   (stone) => `${stone?.stone_name || ""}`
              // );


              /// use need to complex query like lookup or something 

               //  could u please show me if these queries are used in this code?  so i can follow the way or  take some refrence 
              //  console.log(element?.product_details?.Stones);


            // element?.product_details?.Stones?.map(async (v, k, arr) => {
               
            //     arr[k].pcsname = await maste({ _id: arr[k].stone }).then(masterStonename => masterStonename?.Pcs || "");
            //     console.log(arr[k].pcsname, 'arr[k].pcsname');
            //   });


              // const firstStonePcs = element?.product_details?.Stones?.map(
              //   (stone) => `${stone?.Pcs || ""}`
              // );
             
              // const firstStoneCts = element?.product_details?.Stones?.map(
              //   (stone) => `${stone?.Cts || ""}`
              // );
              // const firstStoneUnit = element?.product_details?.Stones?.map(
              //   (stone) => `${stone?.Unit || ""}`
              // );


             const stoneDetails = element?.product_details?.Stones || [];

              const { firstStonePcs, firstStoneCts, firstStoneUnit } = stoneDetails.reduce(
                (acc, stone) => {
                  if (stone?.Pcs) acc.firstStonePcs.push(stone.Pcs);  
                  if (stone?.Cts) acc.firstStoneCts.push(stone.Cts);
                  if (stone?.Unit) acc.firstStoneUnit.push(stone.Unit);
                  return acc;
                },
                { firstStonePcs: [], firstStoneCts: [], firstStoneUnit: [] }
              );
              

              const serviceLabour = element?.product_details?.service_labour;
              const serviceName =
                element?.product_details?.service_labour?.service_laburelist?.map(
                  (service) => service?.name || ""
                );

              rowObj.Description.shortDescription = shortDescription;
              // rowObj.Description.stoneSizeArray = stoneSizeArray;
              rowObj.Description.firstStoneCts = firstStoneCts;
              rowObj.Description.firstStonePcs = firstStonePcs;
              rowObj.Description.firstStoneUnit = firstStoneUnit;
              rowObj.Description.metalName = metalName;
              rowObj.Description.codeName = codeName;
              // rowObj.Description.stoneName = stoneName;
              rowObj.Description.stoneNameShapeArray = serviceName;
              rowObj.Description.servicesArray = servicesArray;

              // console.log(rowObj.Description)

              rowObj.main_image = element?.product_details?.main_image
                ? element?.product_details?.main_image
                : "https://gis247.s3.us-east-2.amazonaws.com/placeholder-blank.png";
              rowObj.SKU = element?.product_details?.SKU;
              rowObj.GrossWt = element?.product_details?.GrossWt;
              console.log(rowObj.GrossWt);

              rowObj.Matatag =
                element?.product_details?.Matatag || "Default Description";
              console.log(rowObj.Matatag);

              rowObj.price =
                servicer_flag == true
                  ? product_price
                  : element?.retailprice_Inc;
              rowObj.amount =
                servicer_flag == true
                  ? product_price
                  : element?.retailprice_Inc;
              rowObj.Qty = element?.Qty;
              rowObj.remark = element?.remark;
              base_amount +=
                servicer_flag == true
                  ? product_price
                  : element?.retailprice_Inc;
              if (element?.type == "custom_order") {
                rowObj.type = element?.type;
                if (element.custom_design) {
                  rowObj.custom_order = true;
                  rowObj.custom_design = element.custom_design;
                }
              }
              if (element?.type == "mix_match") {
                printData.mixMatch = true;
                rowObj.mixMatch = true;
                rowObj.type = element?.type;
                if (element.custom_design) {
                  rowObj.custom_design = element.custom_design;
                }
                rowObj.custom_design = element.custom_design;
                rowObj.diamond_name = element.diamond_details.name;
                rowObj.diamond_Carat = element.diamond_details.Carat;
                rowObj.diamond_StockID = element.diamond_details.StockID;
                rowObj.diamond_img = element.diamond_details.image[0];
                rowObj.diamond_Pcs = element.diamond_details.Pcs;
                rowObj.diamond_TagPrice = priceHelper.toFormatPosPrice(
                  element.diamond_details.TagPrice,
                  { addSymbol: true }
                );
                base_amount += element.diamond_details.TagPrice;
              }
              rows.push(rowObj);
            });
            if (rows.length) {
              printData.itemrow = rows;
            } else {
              printData.itemrow = [];
            }
            printData.totalItem = rows.length;
          }
          printData.discount = result?.reports?.Discount_Amount;
          printData.labour =
            servicer_flag == true
              ? service_labour.reduce((a, b) => {
                  return a + b;
                }, 0)
              : result?.reports?.Labour_Charges;
          printData.Ship_Charges = result?.reports?.Ship_Charges;
          printData.loyality_points = result?.reports?.loyality_points;
          printData.deposit_percent = result?.reports?.Deposit_percent;
          await posModel.getTransactionPayment(
            { order_id: orderId },
            { pay_data: 1, amount: 1 }
          );
          printData.Payment_Method = result?.reports;
          printData.amount = result?.base_amount;
          printData.amount = base_amount;
          printData.grandTotal = result?.reports?.Grand_Total;
          printData.diposit = result?.reports?.Deposit_Amt;
          printData.due = result?.reports?.final_DueAmount;
        }
      })
      .then(async () => {
        let title = "CUSTOM ORDER";
        let filetype = "CUSTOM_ORDER";
        let products;
        let show_row = true;

        if (printData?.itemrow?.length) {
          products = printData.itemrow;
          show_row = false;
        } else {
          products = [];
        }
        let organization_logo = await base64(user().organization_logo).then(
          (res) => {
            return res;
          }
        );
        // let organisatioinData = await OrganizationModel.getOne({ _id: user().organisation_id })
        let organisatioinData = {
          organization: "jeker jewealy",
          address: "233-233 /3 test address",
          city: "test city",
          state: "test state",
        };

        var filename = filetype + "_" + new Date().getTime();
        let time = new Date().toLocaleString();
        let pdfname = `${filename}.pdf`;
        let file = "";
        var invoiceBody = await readFile(
          BASEPATH + printData.printTemplat,
          "utf-8"
        );
        var firstPage = true;
        var countrowStep = 0;
        if (products.length) {
          await forEachAsync(products, async (result, key) => {
            if (result.type == "mix_match") {
              result.Tamount =
                priceHelper.toUnFormatPrice(result?.amount) +
                priceHelper.toUnFormatPrice(result.diamond_TagPrice);
              result.Tamount = priceHelper.toFormatPosPrice(result.Tamount, {
                addSymbol: true,
              });
            }
            countrowStep = countrowStep + 1;
            key = key + 1;
            result.sr_no = key;
            result.price = priceHelper.toFormatPosPrice(result?.price, {
              addSymbol: true,
            });
            result.amount = priceHelper.toFormatPosPrice(result.amount, {
              addSymbol: true,
            });

            if (!result.custom_design) {
              if (firstPage) {
                if (countrowStep == 6) {
                  result.sr_no = key;
                  result.pageBreak = true;
                  firstPage = false;
                  countrowStep = 0;
                }
              } else {
                if (countrowStep == 7) {
                  result.pageBreak = true;
                  countrowStep = 0;
                }
              }
            }

            return result;
          });
        }

        let pural = false;
        let cash_show = false;
        let creditCard_show = false;
        let creditNote_show = false;
        let bank_show = false;
        if (products.length > 1) {
          pural = true;
        }
        if (printData?.Payment_Method?.Cash_Amt != 0) {
          cash_show = true;
        }
        if (printData?.Payment_Method?.CreditCard_Amt != 0) {
          creditCard_show = true;
        }
        if (printData?.Payment_Method?.Credit_note != 0) {
          creditNote_show = true;
        }
        if (printData?.Payment_Method?.Bank_Amt != 0) {
          bank_show = true;
        }
        let templateBodyData = {
          show_row: show_row,
          products: products,
          cash: priceHelper.toFormatPosPrice(
            printData?.Payment_Method?.Cash_Amt,
            { addSymbol: true }
          ),
          bank: priceHelper.toFormatPosPrice(
            printData?.Payment_Method?.Bank_Amt,
            { addSymbol: true }
          ),
          credit_card: priceHelper.toFormatPosPrice(
            printData?.Payment_Method?.CreditCard_Amt,
            { addSymbol: true }
          ),
          credit_notes: priceHelper.toFormatPosPrice(
            printData?.Payment_Method?.Credit_note,
            { addSymbol: true }
          ),
          amount: priceHelper.toFormatPosPrice(printData?.amount, {
            addSymbol: true,
          }),
          discount: priceHelper.toFormatPosPrice(printData?.discount, {
            addSymbol: true,
          }),
          labour: priceHelper.toFormatPosPrice(printData?.labour, {
            addSymbol: true,
          }),
          loyality_points: priceHelper.toFormatPosPrice(
            printData?.loyality_points,
            { addSymbol: true }
          ),
          Ship_Charges: priceHelper.toFormatPosPrice(printData?.Ship_Charges, {
            addSymbol: true,
          }),

          grandTotal: priceHelper.toFormatPosPrice(printData?.grandTotal, {
            addSymbol: true,
          }),
          diposit: priceHelper.toFormatPosPrice(printData?.diposit, {
            addSymbol: true,
          }),
          due: priceHelper.toFormatPosPrice(printData?.due, {
            addSymbol: true,
          }),
          pural: pural,
          cash_show: cash_show,
          creditCard_show: creditCard_show,
          creditNote_show: creditNote_show,
          bank_show: bank_show,
          item: products.length,
          deposit_percent: printData.deposit_percent,
          mixMatch: printData.mixMatch,
        };
        let templateData = {
          title: title,
          organization_name: user().organization_name,
          time: time,
          organization_logo: organization_logo,
          name: "jakapong",
          orgAddress:
            organisatioinData.address +
            "," +
            organisatioinData.city +
            "," +
            organisatioinData.state,
          QRcode: printData.QRcode,
          customerfname: printData?.customer?.fname,
          customermname: printData?.customer?.mname,
          customerlname: printData?.customer?.lname,
          customerCall: printData.customer.contacts.length
            ? `+(${printData.customer.contacts[0].phoneCode})-${printData.customer.contacts[0].number}`
            : "",
          customerid: printData.customerid,
          sales_Consultant: printData.sales_Consultant,
          customeraddress: printData.customeraddress,
          email: printData?.customer?.email,
          taxid: printData.taxId,
          orderNo: printData.orderNo,
          orderDate: printData.orderDate,
          orderDateTime: printData.orderDateTime,
        };
        let invoiceHeaderHtml = await invoiceHeader;
        invoiceHeaderHtml = hb.compile(invoiceHeaderHtml, {
          strict: true,
        });

        let invoiceFooterHtml = await invoiceFooter;
        invoiceFooterHtml = hb.compile(invoiceFooterHtml, {
          strict: true,
        });

        let invoiceBodyHtml = await invoiceBody;

        invoiceBodyHtml = hb.compile(invoiceBodyHtml, {
          strict: true,
        });
        const result = invoiceBodyHtml(templateBodyData);

        const html = result;

        //const browser = await puppeteer.launch({  headless: 'true ' }); // this mode is good for check layout

        const browser = await puppeteer.launch({
          headless: "new",
          args: ["--no-sandbox"],
          timeout: 0,
        });

        const page = await browser.newPage();
        await page.setContent(html);

        await page.pdf({
          path: "./public/reports/" + pdfname,
          format: "A4",
          displayHeaderFooter: true,
          margin: {
            top: "275px",
            right: "15px",
            left: "15px",
            bottom: "110px",
          },
          headerTemplate: invoiceHeaderHtml(templateData),
          footerTemplate: invoiceFooterHtml(templateData),
        });

        await browser.close();

        file = await awsHelper.uploadPDFFile(
          `Pos_invoice/print/${pdfname}`,
          `./public/reports/${pdfname}`
        );
        fs.rm(`./public/reports/${pdfname}`, () => {});

        let encodeURL = utility.toBinary(file);
        let printURLencode = user().domain + "reports/" + encodeURL;
        let printURLdecode = file;
        console.log(printURLdecode, "printURLdecode");
        orderModel
          .updateOrder(
            { _id: orderId },
            { printURL: printURLencode, printURLdecode: printURLdecode }
          )
          .then(async (result) => {
            if (result == true) {
              let createNoti = {
                msg: `${printData.orderNo} Custom Order Invoice Ready For Download`,
                status: 0,
                url: printURLencode,
              };
              await masterModelInv.createNotifications(createNoti);
              resolve(printURLencode);
            } else {
              exports.customeOrderPrint(orderId);
              // LET me compare do not touch mouse for currenly.
            }
          });
      });
  });
};
