const { spawn } = require("child_process");

module.exports = async function openssl(params, env = {}) {
  const defaultENV = process.env;
  return new Promise((resolve, reject) => {
    const stdout = [];
    const stderr = [];
    const openSSLProcess = spawn(`openssl`, params, {
      shell: true,
      env: {
        ...defaultENV,
        ...env
      }
    });

    openSSLProcess.stdout.on("data", data => stdout.push(data));
    openSSLProcess.stderr.on("data", data => stderr.push(data));
    openSSLProcess.on("close", code => {
      if (code !== 0) {
        return reject(new Error(Buffer.concat(stderr)).toString());
      }
      return resolve(Buffer.concat(stdout));
    });
  });
};
