function dataDifference(interval) {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var currentDay = currentDate.getDate();
    var currentMonth = currentDate.getMonth() + 1;
    var currentHour = currentDate.getHours();
    var currentMin = currentDate.getMinutes();


    var outputDate;
    switch (interval) {
        case 1:
            if (currentDay == 1) {
                if (currentMonth == 1) {
                    currentDay = 31;
                    currentYear--;
                    currentMonth = 12;
                } else if (currentMonth == 2 || currentMonth == 4 || currentMonth == 6 || currentMonth == 8 ||
                    currentMonth == 9 || currentMonth == 11)
                    {
                    	currentDay = 31;
                    	currentMonth-=1;
                    			}
                else if (currentMonth == 5 || currentMonth == 7 || currentMonth == 10 || currentMonth == 12)
                    currentDay = 30;
                else {
                    if (currentMonth == 3 && currentYear % 4 == 0)
                        currentDay = 29;
                    else
                        currentDay = 28;
                }

            } else
                currentDay -= 1;

            if (currentHour < 10)
                currentHour = "0".concat("", currentHour);
            if (currentMin < 10)
                currentMin = "0".concat("", currentMin);
            if (currentDay < 10)
                currentDay = "0".concat("", currentDay);
            if (currentMonth < 10)
                currentMonth = "0".concat("", currentMonth);
            outputDate = currentYear + "-" + currentMonth + "-" + currentDay + " " + currentHour + ":" + currentMin;
            break;

        case 2:
            if (currentDay <= 7) {
                if (currentMonth == 1) {
                    currentMonth = 12;
                    currentDay = 31 + currentDay - 7;
                    currentYear--;
                } else if (currentMonth == 2 || currentMonth == 4 || currentMonth == 6 || currentMonth == 8 ||
                    currentMonth == 9 || currentMonth == 11)
                    {currentDay = 31 + currentDay - 7;
                    currentMonth-=1;}
                else if (currentMonth == 5 || currentMonth == 7 || currentMonth == 10 || currentMonth == 12)
                    currentDay = 30 + currentDay - 7;
                else {
                    if (currentMonth == 3 && currentYear % 4 == 0)
                        currentDay = 29 + currentDay - 7;
                    else
                        currentDay = 28 + currentDay - 7;
                }

            } else
                currentDay -= 7;
            if (currentHour < 10)
                currentHour = "0".concat("", currentHour);
            if (currentMin < 10)
                currentMin = "0".concat("", currentMin);
            if (currentDay < 10)
                currentDay = "0".concat("", currentDay);
            if (currentMonth < 10)
                currentMonth = "0".concat("", currentMonth);
            outputDate = currentYear + "-" + currentMonth + "-" + currentDay + " " + currentHour + ":" + currentMin;
            break;

        case 3:
            if (currentMonth == 1) {
                currentMonth = 12;
                currentYear--;
            } else if (currentMonth == 2 || currentMonth == 4 || currentMonth == 6 || currentMonth == 8 ||
                currentMonth == 9 || currentMonth == 11) {
                currentMonth -= 1;
            } else if (currentMonth == 5 || currentMonth == 7 || currentMonth == 10 || currentMonth == 12) {
                if(currentDay==31)
                    currentDay=1;
                else
                    currentMonth -= 1;
            } else {
                if (currentMonth == 3 && currentYear % 4 == 0)
                    currentDay = currentDay - 1;
                else
                    currentDay = currentDay - 2;
                currentMonth -= 1;
            }
            if (currentHour < 10)
                currentHour = "0".concat("", currentHour);
            if (currentMin < 10)
                currentMin = "0".concat("", currentMin);
            if (currentDay < 10)
                currentDay = "0".concat("", currentDay);
            if (currentMonth < 10)
                currentMonth = "0".concat("", currentMonth);
            outputDate = currentYear + "-" + currentMonth + "-" + currentDay + " " + currentHour + ":" + currentMin;
            break;
    }

    return outputDate;
}

module.exports = dataDifference;
