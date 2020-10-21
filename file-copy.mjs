import ncp from "ncp";

ncp.limit = 16;

var srcPath = "./web/build";
var destPath = "./api/build/src/server/public";

console.log("Copying files to Koa Server");
ncp(srcPath, destPath, (err) => {
  if (err) {
    return console.error(err);
  } else {
    console.log("Complete");
  }
});
