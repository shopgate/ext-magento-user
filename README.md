# Shopgate Connect - Magento User Extension

[![GitHub license](http://dmlc.github.io/img/apache2.svg)](LICENSE)
[![Build Status](https://travis-ci.org/shopgate/ext-magento-user.svg?branch=master)](https://travis-ci.org/shopgate/ext-magento-user)
[![Coverage Status](https://coveralls.io/repos/github/shopgate/ext-magento-user/badge.svg?branch=master)](https://coveralls.io/github/shopgate/ext-magento-user?branch=master)


This Magento extension will handle the synchronisation of user related data between Magento and Shopgate Connect.

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

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) file for more information.

## About Shopgate

Shopgate is the leading mobile commerce platform.

Shopgate offers everything online retailers need to be successful in mobile. Our leading
software-as-a-service (SaaS) enables online stores to easily create, maintain and optimize native
apps and mobile websites for the iPhone, iPad, Android smartphones and tablets.

## License

This extension is available under the Apache License, Version 2.0.

See the [LICENSE](./LICENSE) file for more information.

