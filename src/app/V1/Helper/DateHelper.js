const moment = require('moment'); // require
const _ = require('underscore');
module.exports.date_format_change = async (date_format) => {
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


module.exports.formatDate = (date, args = {}) => {
    let response = moment(date, user().date_format).utc(true);
    response = response.startOf("day");

    if (args.dayEnd) {
        response = response.endOf("day");
    }

    return module.exports.toMongoDate(response);
}
module.exports.toMongoDateTime = (date) => {
    let response = moment(date).utc(true);
    response = new Date(response);
    return response;
}
module.exports.toMongoDate = (date, args = {}) => {
    let response;
    if (moment(date, "YYYY/MM/DD", true).isValid()) {
        response = moment(date, "YYYY/MM/DD").utc(true);
    } else if (moment(date, "DD/MM/YYYY", true).isValid()) {
        response = moment(date, "DD/MM/YYYY").utc(true);
    } else if (moment(date, "MM/DD/YYYY", true).isValid()) {
        response = moment(date, "MM/DD/YYYY").utc(true);
    } else {
        response = moment(date).utc(true);
    }

    if (!response.isValid()) {
        response = moment(new Date()).utc(true);
    }

    response = response.startOf("day");

    if (args.dayEnd) {
        response = response.endOf("day");
    }

    response = new Date(response);
    return response;
}

const getDateFormatOptions = (formattedDate, dateFormat, addTime) => {
    const [datePart, timePart] = formattedDate.split(', ');
    const [day, month, year] = datePart.split('/');

    let customFormattedDate;

    switch (dateFormat) {
        case 'DD/MM/YYYY':
            customFormattedDate = `${day}/${month}/${year}`;
            break;
        case 'YYYY/MM/DD':
            customFormattedDate = `${year}/${month}/${day}`;
            break;
        case 'MM/DD/YYYY':
            customFormattedDate = `${month}/${day}/${year}`;
            break;
        case 'MM/YYYY/DD':
            customFormattedDate = `${month}/${year}/${day}`;
            break;
        default:
            customFormattedDate = `${day}/${month}/${year}`; // Default format
            break;
    }

    if (addTime === true && timePart) {
        return `${customFormattedDate}, ${timePart}`;
    }

    return customFormattedDate;
};

module.exports.getDateInOrganisationFormat = (utcDateString, addTime = false) => {
    try {
        let timeFormatOptions = {}
        if (addTime === true) {
            timeFormatOptions = {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }
        }

        const date = new Date(utcDateString);
        const formattedDate = new Intl.DateTimeFormat('en-GB', {
            timeZone: ORG_TIME_ZONE || Intl.DateTimeFormat().resolvedOptions().timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            ...timeFormatOptions
        }).format(date);

        return getDateFormatOptions(formattedDate, user().date_format, addTime);
    } catch (error) {
        console.log(utcDateString, "date String");
        console.error(error);
        return moment(utcDateString).utc(true).format(user().date_format);;
    }
}

module.exports.getDateInPOSFormat = (utcDateString, addTime = false) => {
    try {
        let timeFormatOptions = {}
        if (addTime === true) {
            timeFormatOptions = {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }
        }

        const date = new Date(utcDateString);
        const formattedDate = new Intl.DateTimeFormat('en-GB', {
            timeZone: POS_TIME_ZONE || Intl.DateTimeFormat().resolvedOptions().timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            ...timeFormatOptions
        }).format(date);

        return getDateFormatOptions(formattedDate, POS_DATE_FORMAT, addTime);
    } catch (error) {
        console.error(error);
        return moment(utcDateString).utc(true).format(POS_DATE_FORMAT);;
    }
}

module.exports.getDueDays = (dueDate) => {
    var dueDays = new Date(dueDate).getTime() - new Date().getTime();
    dueDays = parseInt(dueDays / 86400000);
    if (dueDays >= 0) {
        dueDays = 0;
    }
    dueDays = Math.abs(dueDays)
    return dueDays;
}



module.exports.getTimeLine = (date) => {
    let time = moment(date).fromNow();
    return time;
}

module.exports.getAging = (start_date) => {
    let current_date = new Date().getTime();
    let aging = current_date - new Date(start_date).getTime();
    aging = parseInt(aging / 86400000);
    aging = Math.abs(aging)
    return aging;
}







module.exports.toFormatDateInFormat = (date, date_format) => {
    let response = moment(date).utc(true).format(date_format);
    return response;
}

module.exports.dateAndTime = (date, time) => {
    let localtime;
    let response;
    if (!time) {
        localtime = 'h:mm:ss a';
        response = moment(date).utc(true).format(user().date_format + " " + localtime);
    } else {
        response = moment(date).utc(true).format(user().date_format) + " " + time;
    }

    return response;
}

module.exports.localTimeFormate = (date) => {
    let response = moment(date).utc(true).format(user().date_format);
    let time = new Date(date).getTime();
    let seconds = Math.floor(time / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let formattedHours = hours % 24;
    let ampm = formattedHours >= 12 ? 'PM' : 'AM';
    let formattedTime = `${formattedHours % 12 || 12}:${minutes % 60}:${seconds % 60} ${ampm}`;
    return `${response} ${formattedTime}`;
}

module.exports.getAge = (year) => {
    var oneYearFromNow = new Date();
    let age = oneYearFromNow.getFullYear() - parseInt(year);
    return age;
}
module.exports.getAgeDateTo = (dateString) => {
    if (dateString) {
        try {
            let getdatexlxs = module.exports.getDateToobj(dateString);
            const year = getdatexlxs?.year;
            const month = getdatexlxs?.month;
            const day = getdatexlxs?.month;
            const birthDate = new Date(year, month - 1, day);
            const currentDate = new Date();
            const age = currentDate.getFullYear() - birthDate.getFullYear();
            return age;
        } catch {
            return 0;
        }
    } else {
        return 0;
    }

}
const excelDateToJSDate = (serial) => {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(excelEpoch.getTime() + serial * 86400000);
    return {
        date: date.getUTCDate(),
        month: date.getUTCMonth() + 1, // Months are 0-indexed
        year: date.getUTCFullYear()
    };
};
module.exports.getDateToobj = (dateString) => {
    if (dateString) {
        try {
            // Check if the dateString is a number (Excel serial date)
            const serial = parseInt(dateString, 10);
            if (!isNaN(serial) && serial > 10000) { // Assuming serial date values are large numbers
                return excelDateToJSDate(serial);
            }

            // eslint-disable-next-line no-useless-escape
            const dateRegex = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/;
            const match = dateString.match(dateRegex);
            if (!match) {
                throw new Error("Invalid date format");
            }
            const day = parseInt(match[1]);
            const month = parseInt(match[2]);
            const year = parseInt(match[3]);
            return { date: day, month: month, year: year };
        } catch {
            return { date: "01", month: "01", year: "2001" };
        }
    } else {
        return { date: "01", month: "01", year: "2001" };
    }
}
module.exports.ConvertTimeZone = (date) => {
    var targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let convertedDate = date.toLocaleString({ timeZone: targetTimeZone });
    let finalDate = new Date(convertedDate);
    finalDate = finalDate.toISOString();
    moment(finalDate).utc(true).format(user().date_format + " " + 'h:mm:ss a');
}

module.exports.getDurationFilter = (duration) => {
    let filterData = {};

    if (duration === "Daily") {
        let today = new Date();
        let firstDay = new Date(today);
        firstDay.setHours(0, 0, 0, 0);
        filterData['start_date'] = today.toISOString().split('T')[0];
        filterData['end_date'] = today.toISOString().split('T')[0];
    } else if (duration === "Monthly") {
        let firstDayThisMonth = new Date();
        firstDayThisMonth.setDate(1);

        let lastDayThisMonth = new Date(firstDayThisMonth);
        lastDayThisMonth.setMonth(lastDayThisMonth.getMonth() + 1);
        lastDayThisMonth.setDate(0);

        filterData['start_date'] = firstDayThisMonth.toISOString().split('T')[0];
        filterData['end_date'] = lastDayThisMonth.toISOString().split('T')[0];
    } else if (duration === "Yearly") {
        let year = new Date().getFullYear();

        filterData['start_date'] = year + '-01-01';
        filterData['end_date'] = year + '-12-31';
    } else if (duration === "Weekly") {
        let today = new Date();
        let firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        let lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

        filterData['start_date'] = firstDayOfWeek.toISOString().split('T')[0];
        filterData['end_date'] = lastDayOfWeek.toISOString().split('T')[0];
    }

    return filterData;
}

module.exports.generateTimeSlots = (type) => {
    let currentDate = moment(new Date(), user().date_format).utc(true).startOf("day");
    let newDate = new Date(currentDate);
    let timeSlots = [];
    let timeFormat = [];
    for (let i = 0; i < 8; i++) {
        if (type == 'timeSlot') {
            let formattedDate = new Date(newDate.getTime() + i * 3 * 60 * 60 * 1000); // Set hours in increments of 3
            timeSlots.push(formattedDate);
        }
        if (type == 'hourList') {
            let table = 3 * i;
            let date_manage = i <= 3 ? 0 : "";
            timeFormat.push(`${date_manage}${table}:00`);
        }
    }
    if (type == 'timeSlot') {
        return timeSlots;
    }
    if (type == 'hourList') {
        return timeFormat;
    }
}

module.exports.generateMonthTimeSlots = (year) => {
    let dateRanges = [];
    for (let month = 1; month <= 12; month++) {
        dateRanges.push(generateMonthlyDateRange(year, month));
    }
    return dateRanges;
}

const generateMonthlyDateRange = (year, month) => {
    let leepYear = (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0);
    let padNumber = month.toString().padStart(2, '0');
    let daysInMonth = new Date(year, month, 0).getDate();
    let endDate = month === 2 && leepYear === 0 ? 29 : daysInMonth;
    let startDate = `${year}-${padNumber}-01`;
    let endDateString = `${year}-${padNumber}-${endDate.toString().padStart(2, '0')}`;
    return { StaringDate: startDate, endingDate: endDateString };
}

module.exports.generateWeeklyTimeSlots = async () => {
    let currentDate = new Date();
    let currentDay = new Date().getDay();
    let day = ['Mon', 'Tus', 'Wed', 'Thus', 'Fri', 'Sat', 'Sun']
    let monday;
    let Array = [];
    if (currentDay == 1) {
        monday = currentDate;
    } else {
        let diffrenceForMonday = currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
        monday = new Date(currentDate.setDate(diffrenceForMonday));
    }
    await Promise.all(day?.map((element, key) => {
        let Date = key == 0 ? monday : monday.setDate(monday.getDate() + 1);
        let startDate = module.exports.toMongoDate(Date);
        let endDate = module.exports.toMongoDate(Date, { dayEnd: true });
        Array.push({ day: element, startDate: startDate, endDate: endDate })
    }))
    return Array;
}

module.exports.generateYearlyTimeSlots = () => {
    let currentYear = new Date().getFullYear();
    let array = [];
    for (let i = 0; i <= 11; i++) {
        let years = i == 0 ? currentYear : currentYear - i;
        let firstDayThisMonth = moment(`${years}-01-01`).utc(true).startOf("day");
        let lastDayThisMonth = moment(`${years}-12-31`).utc(true).endOf("day");
        array.push({ year: years, start: new Date(firstDayThisMonth), end: new Date(lastDayThisMonth) })
    }
    return _.sortBy(array, "year");
}

module.exports.date_format_change = async (date_format) => {
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

module.exports.calculateDueStatus = (dueDate) => {
    const current = new Date();
    const due = new Date(dueDate);
    const timeDifference = due.getTime() - current.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    if (dayDifference > 0) {
        return `Due in ${dayDifference} day${dayDifference > 1 ? 's' : ''}`;
    } else if (dayDifference === 0) {
        return "Due today";
    } else {
        return `Overdue by ${Math.abs(dayDifference)} day${Math.abs(dayDifference) > 1 ? 's' : ''}`;
    }
};
module.exports.calculateDueStatusboolen = (dueDate) => {
    const current = new Date();
    const due = new Date(dueDate);
    const timeDifference = due.getTime() - current.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    if (dayDifference > 0) {
        return false;
    } else if (dayDifference === 0) {
        return false;
    } else {
        return true;
    }
};
module.exports.getDateTimeAmPM = (date) => {
    const userDateFormat = user().date_format || 'DD/MM/YYYY hh:mm:ss A';
    const momentFormattedDate = moment(date).utc(true).format(userDateFormat);
    console.log("Formatted with moment:", momentFormattedDate);

    // Assuming you still want to keep the Intl.DateTimeFormat part as well
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };

    const intlFormattedDate = new Intl.DateTimeFormat('en-GB', options).format(new Date(date)).replace(',', '');
    console.log("Formatted with Intl.DateTimeFormat:", intlFormattedDate);

    return intlFormattedDate;  // or return intlFormattedDate depending on what you need
}

module.exports.checkDateFormat = (date, args = {}) => {
    let response;
    if (moment(date, "YYYY/MM/DD", true).isValid()) {
        response = moment(date, "YYYY/MM/DD").utc(true);
    } else {
        response = moment(date).utc(true);
    }

    if (!response.isValid()) {
        response = moment(new Date()).utc(true);
    }

    response = response.startOf("day");

    if (args.dayEnd) {
        response = response.endOf("day");
    }

    response = new Date(response);
    return response;

};
// module.exports.getTimeFormat = (date) => {
//     let response = moment(date).utc(true).format('hh:mm A');
//     return response;
// }
module.exports.getTimeFormat = (date) => {
    let timeZone = POS_TIME_ZONE;
    if (!timeZone) {
        timeZone = 'UTC';
    }
    let response = moment(date).tz(timeZone).format('hh:mm A');
    return response;
}
module.exports.getDateInOrganisationFormat_print = (date) => {
    if (!date) {
        return '';
    }
    let parsedDate = moment(date, "YYYY/MM/DD", true);
    if (!parsedDate.isValid()) {
        return 'Invalid Date';
    }
    let response = parsedDate.utc(true).format(user().date_format);
    return response;
}
module.exports.getcalDuedate = (date, days, status) => {
    if (status === "1") {
        const duedate = days;
        const caldays = 7 * parseInt(duedate);
        let result = new Date(date.setDate(date.getDate() + caldays));
        return module.exports.getDateInPOSFormat(result);
    } else {
        let result = new Date(date.setDate(date.getDate() + 7));
        return module.exports.getDateInPOSFormat(result);
    }
}

module.exports.calculateDueStatusKANBAN = (dueDate) => {
    const current = new Date();
    const due = new Date(dueDate);
    const timeDifference = due.getTime() - current.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    if (dayDifference > 4) {
        return module.exports.getDateInOrganisationFormat(dueDate);
    }
    if (dayDifference > 0) {
        return `Due ${dayDifference} day${dayDifference > 1 ? 's' : ''}`;
    } else if (dayDifference === 0) {
        return "Due today";
    } else {
        return `Overdue ${Math.abs(dayDifference)} day${Math.abs(dayDifference) > 1 ? 's' : ''}`;
    }
};