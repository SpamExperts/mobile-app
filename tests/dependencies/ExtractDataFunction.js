function extract_data(formatedDate, currentDate) {
    formatedDate[0] = currentDate[8];
    formatedDate[1] = currentDate[9];
    formatedDate[2] = " ";
    formatedDate[3] = currentDate[4];
    formatedDate[4] = currentDate[5];
    formatedDate[5] = currentDate[6];
    formatedDate[6] = " ";
    formatedDate[7] = "-";
    formatedDate[8] = " ";
    formatedDate[9] = currentDate[8];
    formatedDate[10] = currentDate[9];
    formatedDate[11] = " ";
    formatedDate[12] = currentDate[4];
    formatedDate[13] = currentDate[5];
    formatedDate[14] = currentDate[6];
    formatedDate[15] = " ";
    formatedDate[16] = currentDate[11];
    formatedDate[17] = currentDate[12];
    formatedDate[18] = currentDate[13];
    formatedDate[19] = currentDate[14];
}

module.exports = extract_data;
