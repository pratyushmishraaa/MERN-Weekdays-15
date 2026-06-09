
import figlet from "figlet";
// const figlet = require('figlet');

figlet("Paras", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
});
