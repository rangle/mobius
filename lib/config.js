const _ = require("lodash");
const path = require("path");
const { cosmiconfigSync } = require("cosmiconfig");
const Defaults = require("./defaults");
const { resolvePaths, normalizeSAN, createEnvVars } = require("../utils");

// config file names to search
const configFile = Defaults.MODULE_NAME.toLowerCase();
const searchPlaces = [
  `${configFile}.js`,
  `${configFile}.json`,
  `${configFile}.yaml`,
  `${configFile}.yml`,
  `.${configFile}rc`,
  "package.json"
];
const explorerSync = cosmiconfigSync(configFile, {
  searchPlaces
});

// Default configuration
const defaultConf = cwd => {
  const BASE_DIR = path.resolve(cwd || process.cwd(), Defaults.BASE_DIR);
  const OUT_DIR = path.resolve(BASE_DIR, Defaults.CERT_DIR);
  return {
    out: OUT_DIR,
    databaseFile: Defaults.DATABASE_FILE,
    serialFile: Defaults.SERIAL_FILE,
    dn: {
      country: Defaults.DN_COUNTRY,
      state: Defaults.DN_STATE,
      city: Defaults.DN_CITY,
      org: Defaults.DN_ORG,
      orgUnit: Defaults.DN_ORG_UNIT,
      email: Defaults.DN_EMAIL
    },
    ca: {
      keyFile: Defaults.CA_KEY_FILE,
      certFile: Defaults.CA_CERT_FILE,
      dn: {
        commonName: Defaults.CA_DN_COMMON_NAME
      }
    },
    server: {
      keyFile: Defaults.SERVER_KEY_FILE,
      certFile: Defaults.SERVER_CERT_FILE,
      csrFile: Defaults.SERVER_CSR_FILE,
      dn: {
        commonName: Defaults.SERVER_DN_COMMON_NAME
      },
      domains: ["localhost"],
      ips: ["127.0.0.1", "::1"]
    }
  };
};

// Adds the default module name
const envVarOpts = (...prefixes) => ({
  prefix: [Defaults.MODULE_NAME.toUpperCase()].concat(prefixes || [])
});

/**
 * @public
 * @function getConfig
 * @description get the config with all values normalized and transformed
 * @param {String} cwd - the current working directory
 */
const getConfig = cwd => {
  const defConf = defaultConf(cwd);
  const configFile = explorerSync.search() || { config: defConf };
  let { config } = configFile;
  if (typeof config === "function") {
    // if config was a `.js` file and exported as a function
    config = config(defConf);
  } else {
    // ensure defaults are used as a base
    config = _.merge(defConf, config);
  }

  // resolve base out-path
  const out = path.resolve(cwd, config.out);
  config.out = out;

  // resolve all other file-paths
  config = resolvePaths(config, out, Defaults.PATH_KEYS);

  // TODO:  ensure we always use the defaults, and only append extras before normalizing
  config.server.domains = normalizeSAN(config.server.domains, "DNS");
  config.server.ips = normalizeSAN(config.server.ips, "IP");

  return config;
};

/**
 * @public
 * @function getCaEnv
 * @description constructs all CA environment vars for the conf-file
 * @param {Object} config - the config options
 */
const getCaEnv = config => {
  const { out: certDir, databaseFile, serialFile, dn: commonDN, ca } = config;
  const { dn: caDN, ...caOpts } = ca;
  return {
    ...createEnvVars(
      {
        certDir,
        databaseFile,
        serialFile,
        ...caOpts
      },
      envVarOpts()
    ),
    ...createEnvVars(
      {
        ...commonDN,
        ...caDN
      },
      envVarOpts("dn")
    )
  };
};

/**
 * @public
 * @function getServerEnv
 * @description constructs all Server Cert environment vars for the conf-file
 * @param {Object} config - the config options
 */
const getServerEnv = config => {
  const { out: certDir, dn: commonDN, server } = config;
  const { dn: servDN, domains, ips, ...servOpts } = server;
  return {
    ...createEnvVars(
      {
        certDir,
        ...servOpts
      },
      envVarOpts()
    ),
    ...createEnvVars(
      {
        ...commonDN,
        ...servDN
      },
      envVarOpts("dn")
    ),
    ...createEnvVars(
      {
        san: domains + "," + ips
      },
      envVarOpts()
    )
  };
};

module.exports = {
  getConfig,
  getServerEnv,
  getCaEnv
};
