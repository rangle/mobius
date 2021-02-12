#!/usr/bin/env node

const path = require("path");
const shx = require("shelljs");

// Docker is required
if (!shx.which("docker")) {
  shx.echo("Sorry, Docker is required to run this script");
  shx.exit(1);
}

// run the app in docker
const cwdDir = process.cwd();
const localAppDir = path.resolve(__dirname, "../");

const appDir = "/mobius/app";
const appOutDir = "/mobius/output";
shx.exec(
  `docker run -v ${localAppDir}:${appDir} -v ${cwdDir}:${appOutDir} -w ${appOutDir} -i --rm pionl/node-with-openssl:alpine node ${appDir}/index.js --cwd ${appOutDir}`
);
