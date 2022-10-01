const fs = require("fs");

//create necessary directory
let dir = "./backup/turkishfoodmart";
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const today_date = new Date().toISOString().split("T")[0];
let dirToday = dir + "/backUp_of_" + today_date;
if (!fs.existsSync(dirToday)) fs.mkdirSync(dirToday);

let dirTodo = dirToday + "/toDo_Db";
// if (!fs.existsSync(dirTodo)) fs.mkdirSync(dirTodo);

let dirTodoMain = dirTodo + "/main.json";
// if (!fs.existsSync(dirTodoMain)) {
//   obj = {
//     categories: 0,
//     catPage: 0,
//     product: 0,
//   };
//   fs.writeFile(dirTodoMain, JSON.stringify(obj), "utf8", function (err) {
//     if (err) {
//       return console.log(err);
//     }
//   });
// }

// // addCategorys
let dirTodoCat = dirTodo + "/categories";
// if (!fs.existsSync(dirTodoCat)) fs.mkdirSync(dirTodoCat);

// // addCategorys
let dirTodoCatPage = dirTodo + "/catPage";
// if (!fs.existsSync(dirTodoCatPage)) fs.mkdirSync(dirTodoCatPage);

async function parseObjFromDir(dir) {
  let text = await require(dir);
  return text;
}

async function writeObjDir(dir, obj) {
  fs.writeFile(dir, JSON.stringify(obj), "utf8", function (err) {
    if (err) {
      return console.log(err);
    }
  });
}

async function addDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const getFileList = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => !dirent.isDirectory())
    .map((dirent) => dirent.name);

module.exports = {
  dirToday,
  dirTodo,
  dirTodoMain,
  dirTodoCat,
  dirTodoCatPage,
  today_date,
  parseObjFromDir,
  writeObjDir,
  getDirectories,
  getFileList,
  addDir,
};
