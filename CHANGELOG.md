# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Changed
- Switched frontend to support PWA 6.X

## [1.3.1] - 2018-12-05
### Fixed
- internal debug logging of requests to Magento
- incompatible addresses due to different province codes
- fixed handling of the login strategy in the hook step for basic strategy

### Changed
- guest checkout now depends on the config 'guest_login_mode'

## [1.3.0] - 2018-10-01
### Added
- pipeline for retrieving/deleting/updating/creating customer addresses
- pipeline for updating a customer password
- pipeline for updating a customer email
- pipeline for updating a customer
- support for guest checkout
- login pipeline hook step to allow authentication with external identity service (facebook)

### Fixed
- pipeline for retrieving customer details

## [1.2.0]
### Fixed
- checkout button to not be clickable multiple times

[Unreleased]: https://github.com/shopgate/ext-magento-user/compare/v1.3.1...HEAD
[1.3.1]: https://github.com/shopgate/ext-magento-user/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/shopgate/ext-magento-user/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/shopgate/ext-magento-user/compare/v1.1.7...v1.2.0
