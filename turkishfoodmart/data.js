const fs = require('fs');
const today_date = new Date().toISOString().split('T')[0];
//let data = fs.readFileSync("./data_of_turkishfoodmart_" + today_date + ".json");
let data = fs.readFileSync("./data_of_turkishfoodmart_2022-09-27.json");
data = JSON.parse(data);
module.exports = data;