const fs = require("fs-extra");
const path = require("path");
const shx = require("shelljs");
const openssl = require("./openssl");
const Defaults = require("./defaults");
const addToTrustStore = require("./addToTrustStore");

module.exports = async function generateCA(env) {
  const caFile = env[`${Defaults.MODULE_NAME}_CERT_FILE`];
  const confFile = path.resolve(__dirname, "../conf/ca.cnf");

  // does the CA already exist?
  if (fs.existsSync(caFile)) {
    shx.echo("Root-CA already created, skipping");
    return true;
  }

  try {
    await openssl(
      [
        "req",
        "-x509",
        "-config",
        confFile,
        "-newkey",
        "rsa:4096",
        "-sha256",
        "-nodes",
        "-out",
        caFile,
        "-outform",
        "PEM"
      ],
      env
    );

    // add to trust store
    addToTrustStore(caFile);
  } catch (e) {
    throw e;
  }
};
