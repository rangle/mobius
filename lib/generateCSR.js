const path = require("path");
const Defaults = require("./defaults");
const openssl = require("./openssl");

module.exports = async function generateCSR(env) {
  const csrFile = env[`${Defaults.MODULE_NAME}_CSR_FILE`];
  const confFile = path.resolve(__dirname, "../conf/server.cnf");
  try {
    await openssl(
      [
        "req",
        "-config",
        confFile,
        "-newkey",
        "rsa:2048",
        "-sha256",
        "-nodes",
        "-out",
        csrFile,
        "-outform",
        "PEM"
      ],
      env
    );
  } catch (e) {
    throw e;
  }
};
