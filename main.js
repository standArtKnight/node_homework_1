const fs = require("fs");
const path = require("path");

let shouldDelete = false;
let base = "./test";
let catalog = "./catalog";

for (let i = 1; i < process.argv.length; i++) {
  if (process.argv[i] == "--delete") {
    shouldDelete = true;
  } else if (process.argv[i] == "--sourceDir") {
    base = process.argv[i + 1];
  } else if (process.argv[i] == "--targetDir") {
    catalog = process.argv[i + 1];
  }
}

if (!fs.existsSync(catalog)) {
  fs.mkdirSync(catalog);
}

const readDir = dir => {
  const files = fs.readdirSync(dir);
  files.forEach(item => {
    let localBase = path.join(dir, item);
    let state = fs.statSync(localBase);
    if (state.isDirectory()) {
      readDir(localBase);
    } else {
      let newPath = path.normalize(path.join(catalog, item[0].toUpperCase()));
      if (!fs.existsSync(newPath)) {
        fs.mkdirSync(newPath);
      }
      if (!fs.existsSync(path.join(newPath, item))) {
        fs.copyFileSync(localBase, path.join(newPath, item));
      }
    }
  });
};

const deleteDir = dir => {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);

  files.forEach(item => {
    let localBase = path.join(dir, item);
    let state = fs.statSync(localBase);
    if (state.isDirectory()) {
      deleteDir(localBase);
    } else {
      fs.unlinkSync(localBase);
    }
  });
  fs.rmdirSync(dir);
};

readDir(base);

if (shouldDelete) {
  deleteDir(base);
}
