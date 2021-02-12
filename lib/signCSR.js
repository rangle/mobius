const path = require("path");
const Defaults = require("./defaults");
const openssl = require("./openssl");

module.exports = async function signCSR(caEnv, servEnv) {
  const crtFile = servEnv[`${Defaults.MODULE_NAME}_CERT_FILE`];
  const csrFile = servEnv[`${Defaults.MODULE_NAME}_CSR_FILE`];
  const confFile = path.resolve(__dirname, "../conf/ca.cnf");
  try {
    await openssl(
      [
        "ca",
        "-batch",
        "-config",
        confFile,
        "-policy",
        "signing_policy",
        "-extensions",
        "signing_req",
        "-out",
        crtFile,
        "-infiles",
        csrFile
      ],
      caEnv
    );
  } catch (e) {
    throw e;
  }
};
