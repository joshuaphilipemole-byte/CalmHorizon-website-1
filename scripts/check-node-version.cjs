const fs = require("fs");
const path = require("path");

const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"),
);

const required = packageJson.engines && packageJson.engines.node;
const match = /^>=(\d+)\.(\d+)\.(\d+)$/.exec(required || "");

if (!match) {
  process.exit(0);
}

const minimum = match.slice(1).map(Number);
const current = process.versions.node.split(".").map(Number);
var isSupported = true;

for (var index = 0; index < minimum.length; index += 1) {
  if (current[index] > minimum[index]) {
    break;
  }

  if (current[index] < minimum[index]) {
    isSupported = false;
    break;
  }
}

if (!isSupported) {
  console.error(
    "This project requires Node " +
      required +
      ". Current Node is " +
      process.versions.node +
      ".",
  );
  console.error("Run `nvm use`, `fnm use`, or install Node 22.16.0+ before continuing.");
  process.exit(1);
}
