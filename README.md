<p align="center">
  <img width="150" src="./mobius.png" />
</p>

<h1 align="center">Mobius Cert</h1>

A util to create Root-CA and Server certificates for use with `localhost` served projects.

<hr/>

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://rangle.io)
[![docker](https://img.shields.io/badge/Docker-required-orange?style=flat&logo=docker)](https://www.docker.com/)
[![openssl](https://img.shields.io/badge/OpenSSL-v1.1.1-blue)](https://www.openssl.org/)

## Install

```
yarn add -D @rangleio/mobius
```

## Usage

Currently you will have to add the Root CA Cert to the system root-store and to browser-specific stores. Follow the steps below to configure.

1. Run the script to invoke docker and create the certificates

   ```
   mobius
   ```

2. Add thee `ca.crt ` to your root-store

- **Platform**
  1. **OSX** - Drag the `ca.crt` file to your keychain, double-click the cert and apply `always trust`.
  2. **Win** - coming soon
  3. **Linux** - coming soon
- **Browser**
  1. **Firefox** - Manually import to FF Store

### Configuration

Configuration can be in one of the following files:

- `.mobiusrc` (JSON or YML)
- `mobius.js`
- `mobius.json`
- `mobius.yml` or `mobius.yaml`
- `package.json` under `"mobius"`

Everything is optional in the config. Only values added will be overridden from the default (below)

#### Default Config

```js
{
  // output for all certificates
  out: ".",
  // for tracking the certs created by OpenSSL
  databaseFile: "cert-db.txt",
  serialFile: "cert-serial.txt",
  // Common Distinguished Names
  dn: {
    country: "CA",
    state: "Test State",
    city: "Test City",
    org: "Test Org",
    orgUnit: "IT",
    email: "hello@example.com"
  },
  // Root CA Cert
  ca: {
    // key file name
    keyFile: "ca.key",
    // certificate file name
    certFile: "ca.crt",
    // merges with Common DN above
    dn: {
      // Required
      commonName: "Mobius Localhost CA"
    }
  },
  server: {
    // key file name
    keyFile: "server.key",
    // certificate file name
    certFile: "server.crt",
    // certificate signing request name
    csrFile: "server.csr",
    // merges with Common DN above
    dn: {
      // Required
      commonName: "Mobius Localhost Server"
    },
    // domains allowed for server
    domains: ["localhost"],
    // IP's allowed for server
    ips: ["127.0.0.1", "::1"]
  }
}
```

If using a .`js` file, you can optionally return a function that accepts the default configuration, and extend it.

```js
module.exports = (defaultConfig) => ({
  ...defaultConfig,
  out: "./path/to/out" // only override the out property
});
```
