module.exports = {
  MODULE_NAME: "MOBIUS",
  PATH_KEYS: ["keyFile", "certFile", "csrFile", "databaseFile", "serialFile"],
  BASE_DIR: ".",
  CERT_DIR: "cert",

  DATABASE_FILE: "cert-db.txt",
  SERIAL_FILE: "cert-serial.txt",

  CA_CERT_FILE: "ca.crt",
  CA_KEY_FILE: "ca.key",

  SERVER_CSR_FILE: "server.csr",
  SERVER_CERT_FILE: "server.crt",
  SERVER_KEY_FILE: "server.key",

  DN_COUNTRY: "CA",
  DN_STATE: "Test State",
  DN_CITY: "Test City",
  DN_ORG: "Test Org",
  DN_ORG_UNIT: "IT",
  DN_EMAIL: "hello@example.com",

  CA_DN_COMMON_NAME: "Mobius Localhost CA",
  SERVER_DN_COMMON_NAME: "Mobius Localhost Server"
};
