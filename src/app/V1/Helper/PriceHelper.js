const currencyFormatter = require('currency-formatter'); // require 
const currencysymbol = require('currency-symbol-map');
module.exports.format = (locale, currency, number) => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        currencyDisplay: "code"
    })
        .format(number)
        .replace(currency, "")
        .trim();
}

module.exports.toFormatPrice = (amount, args = {}) => {
    if (isNaN(amount)) {
        return 0;
    }
    var price_format_options = user().price_format;
    var currency = price_format_options?.currency || "USD";
    // var show_amount_in = price_format_options?.show_amount_in || "Million";
    var decimal_point = price_format_options?.decimal_point || 2;
    var thousand_separator = price_format_options?.thousand_separator || ",";
    var decimal_separator = '.';

    if (thousand_separator.search(".")) {
        decimal_separator = ",";
    }

    if (args.currency) {
        currency = args.currency;
    }

    // if (show_amount_in === "Million") {
    var options = {
        // locale: 'en-IN',
        code: currency,
        decimal: decimal_separator,
        thousand: thousand_separator,
        precision: decimal_point,
        format: '%v' // %s is the symbol and %v is the value
    }

    if (args.addSymbol) {
        options.format = '%s %v';
    }

    if (currency == "AED") {
        options.format = '%v %s';
        options.symbol = "AED";
    }
    amount = currencyFormatter.format(amount, options);
    // } else {
    //     // var old_amount = Intl.NumberFormat('en-IN', { style: 'currency', currency: "INR", minimumFractionDigits: decimal_point }).format(amount);
    //     // amount = old_amount.replaceAll(",", thousand_separator); // thousand_separator
    //     // amount = old_amount.replace(".", decimal_separator); //decimal_separator    
    //     amount = module.exports.format('en-IN', 'INR', amount);
    //     if (args.addSymbol) {
    //         var currency_symbol = currencyFormatter.findCurrency(currency);
    //         amount = amount.replace("₹", currency_symbol?.symbol + " ");

    //     }
    // }
    return amount;
}

module.exports.tocurrency = () => {
    var price_format_options = user().price_format;
    var currency = price_format_options?.currency || "USD";
    var currency_symbol = currencyFormatter.findCurrency(currency);
    return currency_symbol?.symbol

}


module.exports.toUnFormatPrice = (amount, args = {}) => {
    var price_format_options = user().price_format;
    var currency = price_format_options?.currency || "USD";
    var show_amount_in = price_format_options?.show_amount_in || "Million";
    var decimal_point = price_format_options?.decimal_point || 2;
    var thousand_separator = price_format_options?.thousand_separator || ",";
    var decimal_separator = '.';
    if (thousand_separator === '.') {
        decimal_separator = ',';
    }
    if (typeof amount == 'string') {
        let parts = amount?.split('.');
        if (parts.length > 2) {
            // Rejoin all parts except the last with no separator
            let integerPart = parts.slice(0, -1).join('');
            let decimalPart = parts[parts.length - 1];
            amount = integerPart + '.' + decimalPart;
            // console.log(integerPart, "amount", decimalPart, "dsfdf", amount);
            return parseFloat(amount);
        }
    }
    if (show_amount_in === "Million") {
        var options = {
            // locale: 'en-IN',
            code: currency,
            decimal: decimal_separator,
            thousand: thousand_separator,
            precision: decimal_point,
            format: '%v' // %s is the symbol and %v is the value
        }
        if (args.addSymbol) {
            options.format = '%s %v';
        }
        amount = currencyFormatter.unformat(amount, options);
    } else {
        var old_amount = Intl.NumberFormat('en-IN', { style: 'currency', currency: "INR", minimumFractionDigits: decimal_point }).format(amount);
        // amount = old_amount.replaceAll(",",thousand_separator); // thousand_separator
        // amount = old_amount.replace(".",decimal_separator); //decimal_separator      

        amount = old_amount.replaceAll(thousand_separator, ""); // thousand_separator
        amount = old_amount.replace(decimal_separator, "."); //decimal_separator      

        if (args.addSymbol) {
            var currency_symbol = currencyFormatter.findCurrency(currency);
            // amount = old_amount.replace("₹",currency_symbol?.symbol + " ");
            amount = old_amount.replace(currency_symbol?.symbol + " ", "");
        }
    }
    return amount;
}
module.exports.toUnFormatPrice_product = (amount, args = {}) => {
    if (typeof amount === 'number') {
        return amount;
    }

    if (typeof amount !== 'string' || amount.trim() === '') {
        return 0;
    }

    var price_format_options = args.price_format || {};
    var currency = price_format_options.currency || "USD";
    var thousand_separator = price_format_options.thousand_separator || ",";
    var decimal_separator = price_format_options.decimal_separator || ".";
    var decimal_point = price_format_options.decimal_point || 2;

    var unformattedAmount = amount.split(thousand_separator).join('').split(decimal_separator).join('.');

    if (isNaN(unformattedAmount)) {
        return 0;
    }

    var options = {
        code: currency,
        decimal: decimal_separator,
        thousand: thousand_separator,
        precision: decimal_point,
        format: '%v' // %s is the symbol and %v is the value
    };

    if (args?.addSymbol) {
        options.format = '%s %v';
    }

    var formattedAmount = parseFloat(unformattedAmount);

    if (args?.addSymbol) {
        return currencyFormatter.format(formattedAmount, options);
    } else {
        return formattedAmount;
    }
}



module.exports.getRetailPrice = (priceDetails, location) => {
    var price = 0.00;
    if (priceDetails) {
        priceDetails.forEach((element) => {
            if (element?.location) {
                if (element.location == location) {
                    price = parseFloat(module.exports.toUnFormatPrice(element.retailprice_Inc));
                }
            }
        });
    }
    return price;
}



module.exports.toFormatPosPrice = (amount, args = {}) => {
    if (isNaN(amount)) {
        return 0;
    }
    var price_format_options = user()?.pos?.price_format;
    var currency = price_format_options?.currency || "USD";
    // var show_amount_in = price_format_options?.show_amount_in || "Million";
    var decimal_point = price_format_options?.decimal_point || 2;
    var thousand_separator = price_format_options?.thousand_separator || ",";
    var decimal_separator = '.';

    if (thousand_separator.search(".")) {
        decimal_separator = ",";
    }

    // if (show_amount_in === "Million") {
    var options = {
        // locale: 'en-IN',
        code: currency,
        decimal: decimal_separator,
        thousand: thousand_separator,
        precision: decimal_point,
        format: '%v' // %s is the symbol and %v is the value
    }

    if (args.addSymbol) {
        options.format = '%s %v';
    }

    if (currency == "AED") {
        options.format = '%v %s';
        options.symbol = "AED";
    }
    amount = currencyFormatter.format(amount, options);
    // } else {
    //     // var old_amount = Intl.NumberFormat('en-IN', { style: 'currency', currency: "INR", minimumFractionDigits: decimal_point }).format(amount);
    //     // amount = old_amount.replaceAll(",", thousand_separator); // thousand_separator
    //     // amount = old_amount.replace(".", decimal_separator); //decimal_separator    
    //     amount = module.exports.format('en-IN', 'INR', amount);
    //     if (args.addSymbol) {
    //         var currency_symbol = currencyFormatter.findCurrency(currency);
    //         amount = amount.replace("₹", currency_symbol?.symbol + " ");

    //     }
    // }
    return amount;
}

module.exports.NewtoFormatPosPrice = (amount, args = {}) => {
    var price_format_options = user()?.pos?.price_format || {};
    var currency = price_format_options.currency || "USD";
    var show_amount_in = price_format_options.show_amount_in || "Million";
    var decimal_point = price_format_options.decimal_point || 2;
    var thousand_separator = price_format_options.thousand_separator || ",";
    var decimal_separator = price_format_options.decimal_separator || ".";

    if (thousand_separator === ".") {
        decimal_separator = ",";
    }

    // Convert amount based on show_amount_in option
    if (show_amount_in === "Million") {
        amount = amount / 1e6;
    } else if (show_amount_in === "Lakh") {
        amount = amount / 1e5;
    }

    // Format amount
    var formatted_amount = amount.toFixed(decimal_point);
    var parts = formatted_amount.split('.');
    if (show_amount_in === "Lakh") {
        // Format for Lakh (Indian numbering system)
        var integerPart = parts[0];
        var fractionalPart = parts.length > 1 ? decimal_separator + parts[1] : '';

        // Use regex to format the integer part for Lakh
        var lastThreeDigits = integerPart.slice(-3);
        var otherDigits = integerPart.slice(0, -3);
        if (otherDigits !== '') {
            lastThreeDigits = thousand_separator + lastThreeDigits;
        }
        var lakhFormatted = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, thousand_separator) + lastThreeDigits;

        formatted_amount = lakhFormatted + fractionalPart;
    } else {
        // Format for Million (International numbering system)      
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousand_separator);
        formatted_amount = parts.join(decimal_separator);
    }

    // Add currency symbol if required
    if (args.addSymbol) {
        var currency_symbol = currencyFormatter.findCurrency(currency)?.symbol || "$";
        formatted_amount = `${currency_symbol} ${formatted_amount}`;
    }

    return formatted_amount;
}

module.exports.getCurrencySymbol = () => {
    var price_format_options = user()?.pos?.price_format;
    var currency = price_format_options?.currency;
    var currency_symbol = currencyFormatter.findCurrency(currency);
    return currency_symbol?.symbol;
}

module.exports.getCurrencySymbolForPos = () => {
    return new Promise(async (resolve) => {
        var price_format_options = user()?.pos?.price_format;

        var currency = price_format_options?.currency;
        var currency_symbol = currencysymbol(currency);
        if (currency_symbol) {
            resolve(currency_symbol);
        } else {
            resolve();
        }
    })
}

module.exports.uniqeID = (length = 8) => {
    let firstPhase = new Date().getFullYear();
    let secondPhase = new Date().getTime();
    let thirdPhase = Array.from({ length: length }, () => Math.floor(Math.random() * 10)).join('')
    return `${firstPhase}${secondPhase}${thirdPhase}`;
}

module.exports.generateMongoID = () => {
    const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
    const machineIdentifier = 'xxxxxxxxxxxx'.replace(/x/g, () => Math.floor(Math.random() * 16).toString(16));
    const processIdentifier = 'xx'.replace(/x/g, () => Math.floor(Math.random() * 16).toString(16));
    const counter = 'xxxx'.replace(/x/g, () => Math.floor(Math.random() * 16).toString(16));
    return timestamp + machineIdentifier + processIdentifier + counter;
}

module.exports.toUnFormatPosPrice = (amount, args = {}) => {
    var price_format_options = user()?.pos?.price_format;
    var currency = price_format_options?.currency || "USD";
    // var show_amount_in = price_format_options?.show_amount_in || "Million";
    var decimal_point = price_format_options?.decimal_point || 2;
    var thousand_separator = price_format_options?.thousand_separator || ",";
    var decimal_separator = '.';

    if (thousand_separator.search(".")) {
        decimal_separator = ",";
    }


    var options = {
        // locale: 'en-IN',
        code: currency,
        decimal: decimal_separator,
        thousand: thousand_separator,
        precision: decimal_point,
        format: '%v' // %s is the symbol and %v is the value
    }
    if (args.addSymbol) {
        options.format = '%s %v';
    }
    amount = currencyFormatter.unformat(amount, options);

    return amount;
}

module.exports.newtoUnFormatPosPrice = (formattedAmount, args = {}) => {
    var price_format_options = user()?.pos?.price_format || {};
    var currency_symbol = price_format_options.currency_symbol || "$";
    var thousand_separator = price_format_options.thousand_separator || ",";
    var decimal_separator = price_format_options.decimal_separator || ".";

    // Remove currency symbol if present
    if (args.removeSymbol) {
        formattedAmount = formattedAmount.replace(currency_symbol, '').trim();
    }

    // Replace thousand separator with an empty string
    formattedAmount = formattedAmount.split(thousand_separator).join('');

    // Replace decimal separator with a period (.)
    formattedAmount = formattedAmount.split(decimal_separator).join('.');

    // Convert to number
    return parseFloat(formattedAmount);
}

module.exports.serachRegexPattern = (search) => {
    if (search) {
        let cleanSearch = search.replace(/[-\s]/g, '');
        // Create a regex pattern to match the cleaned search term with optional spaces or hyphens between characters
        let regexString = cleanSearch.split('').map(char => `${char}[-\\s]*`).join('');
        return new RegExp(regexString, 'i'); // Case-insensitive regex
    } else {
        return "";
    }
}

