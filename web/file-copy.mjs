import ncp from "ncp";

ncp.limit = 16;

var srcPath = "./build";
var destPath = "../api/build/public";

console.log("Copying files to Koa Server");
ncp(srcPath, destPath, (err) => {
  if (err) {
    return console.error(err);
  } else {
    console.log("Copying files complete.");
  }
});
