const _ = require("lodash");
const path = require("path");

/**
 * @function resolvePaths
 * @description recursive function to resolve values based on provided keys
 * @param {Object} obj - the object to transform
 * @param {String} base - the base path to resolve "from"
 * @param {String[]} keys - the object-keys to transform (only these keys will be resolved)
 */
function resolvePaths(obj, base = "", keys = []) {
  return _.transform(
    obj,
    function (result, value, key) {
      result[key] =
        _.isObject(value) && !_.isArray(value)
          ? resolvePaths(value, base, keys)
          : keys.includes(key)
          ? path.resolve(base, value)
          : value;
      return result;
    },
    {}
  );
}

/**
 * @function normalizeSAN
 * @description transforms an array of items to OpenSSL `subjectAltName` format
 * @param {String[]} list - the array of items to transform
 * @param {String} [prefix=DNS] - the `subjectAltName` prefix to use (DNS or IP)
 */
function normalizeSAN(list, prefix = "DNS") {
  return list.map((v, i) => `${prefix}:${v}`).join(",");
}

/**
 * @function createEnvVars
 * @description transforms object-keys to Environment Constant format (i.e. ALL_UPPERCASE)
 * @param {Object} config - the object to transform
 * @param {Object} options - transform options
 * @param {String|String[]} options.prefix - optional strings to prepend to key
 * @example
 * const cfg = {myKey: "value"};
 * const env = createEnvVars(cfg);
 * // expected output:  {MY_KEY: "value"};
 *
 * const env = createEnvVars(cfg, {prefix: "pre"});
 * // expected output:  {PRE_MY_KEY: "value"};
 *
 * const env = createEnvVars(cfg, {prefix: ["ONE","TWO"]});
 * // expected output:  {ONE_TWO_MY_KEY: "value"};
 */
function createEnvVars(config, { prefix = [] } = {}) {
  prefix = _.isArray(prefix) ? prefix : [prefix];
  prefix = prefix.length ? prefix.join("_") + "_" : "";
  return Object.entries(config).reduce((r, [k, v]) => {
    r[`${prefix.toUpperCase()}${_.snakeCase(k).toUpperCase()}`] = v;
    return r;
  }, {});
}

module.exports = {
  resolvePaths,
  normalizeSAN,
  createEnvVars
};
