# Magento User Extension For Shopgate Connect

[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE.md)

An extension for the Shopgate Connect platform that synchronizes user interactions with a Magento CE/EE stores.

## Local Test Execution
### Unit Tests

Unit tests can be executed by running `npm test`.

### End-to-end tests

End-to-end tests have been implemented using Postman / Newman.

#### Requirements

* a fully set up Magento shop is required, including the [Shopgate Cloud Integration Extension](https://github.com/shopgate/cloud-integration-magento/releases)
* a sandbox shop at Shopgate must be connected to that Magento shop

#### Prerequisites

Create an environment.json file for Newman:<br />
`npm run init-newman <your test user's email address> <your test user's password>`

Install the [Shopgate Platform SDK](https://www.npmjs.com/package/@shopgate/platform-sdk) and log in:<br />
`npm i -g @shopgate/platform-sdk`<br />
`sgconnect login`

Create a project and copy this project's contents to the `extension` folder:<br />
`cd your-empty-project-folder`<br />
`sgconnect init`<br />
`cp -R path-to-your-extensions/magento-user your-empty-project-folder/extensions` (or use your favorite sync software)

Attach the extension:<br />
`sgconnect extension attach magento-user`

Start the SDK:<br />
 `sgconnect backend start`

#### Execution

Once you see the `Pipeline proxy is listening on 8090` log message from the SDK you can run the end-to-end tests:
`npm run newman`

## Changelog

See [CHANGELOG.md](CHANGELOG.md) file for more information.

## License

The Magento User Extension is available under the Apache License, Version 2.0.

See the [LICENSE.md](LICENSE.md) file for more information.
