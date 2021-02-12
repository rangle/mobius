const fs = require("fs-extra");
const shx = require("shelljs");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { getConfig, getCaEnv, getServerEnv } = require("./lib/config");
const generateCA = require("./lib/generateCA");
const generateCSR = require("./lib/generateCSR");
const signCSR = require("./lib/signCSR");

const args = yargs(hideBin(process.argv)).alias("h", "help").option("cwd", {
  description: "the working directory for output",
  default: process.cwd()
}).argv;

async function setup(cfg) {
  // openssl is required
  if (!shx.which("openssl")) {
    shx.echo(
      "Error: Sorry, this script requires openssl inistalled on your system"
    );
    shx.exit(1);
  }

  let { out: outPath, databaseFile, serialFile } = cfg;

  // Ensure out path exists
  if (!fs.existsSync(outPath)) {
    fs.mkdirpSync(outPath);
    fs.writeFileSync(databaseFile, "");
    fs.writeFileSync(serialFile, "01");
  }
}

async function run(cwd) {
  const cfg = getConfig(cwd);

  await setup(cfg);

  const caEnv = getCaEnv(cfg);
  const servEnv = getServerEnv(cfg);

  await generateCA(caEnv).catch(e => console.error(e));
  await generateCSR(servEnv).catch(e => console.error(e));
  await signCSR(caEnv, servEnv).catch(e => console.error(e));
}

// Autorun
run(args.cwd);
