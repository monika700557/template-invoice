module.exports.genRandonString = (length) => {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charLength = chars.length;
    var result = '';
    for (var i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
}


module.exports.date_format_change = (date_format) => {
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

module.exports.toBinary = (string) => {
    const codeUnits = new Uint16Array(string.length);
    for (let i = 0; i < codeUnits.length; i++) {
        codeUnits[i] = string.charCodeAt(i);
    }
    let url = btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
    return url.replace(/[=]/g, "");
}

module.exports.date_Picker_format_change = (date_format) => {
    var response;
    if (date_format == "DD/MM/YYYY") {
        response = "dd/MM/yyyy";
    } else if (date_format == 'YYYY/MM/DD') {
        response = "yyyy/MM/dd";
    } else if (date_format == 'MM/DD/YYYY') {
        response = "MM/dd/yyyy";
    } else if (date_format == 'MM/YYYY/DD') {
        response = "MM/yyyy/dd";
    }
    return response;
}