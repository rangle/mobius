const os = require("os");
const shx = require("shelljs");

module.exports = function addToTrustStore(file) {
  // `file` currently points to the docker path of the certificate, this would need to
  // change to the actual cwd of where the script was run.
  if (os.platform() === "win32") {
    // TODO
    shx.echo(
      "Adding to the Windows System Store is not currently implemented."
    );
  } else {
    // TODO: Can this run without `sudo` or ask in shell?
    /* shx.exec(
      `security add-trusted-cert -d -r trustRoot -k "/Library/Keychains/System.keychain" ${file} `
    ); */
    shx.echo(
      "Adding to the OSX System Store is not currently implemented.  Run the following command in Terminial"
    );
    shx.echo(
      `sudo security add-trusted-cert -d -r trustRoot -k "/Library/Keychains/System.keychain" {{path to ca.crt}}`
    );
  }
};
