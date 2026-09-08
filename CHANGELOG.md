# Changelog

All notable changes to the Vehicle Tracking & Fleet Monitoring Platform are documented here.

## [Unreleased]

### Added
- JWT-based authentication for protected API access.
- Vehicle, driver, trip, and vehicle location management APIs.
- Trip status history audit trail.
- Fleet synchronization between trip, driver, and vehicle status.
- Automated health endpoint test.
- Environment-based JWT security configuration.

### Fixed
- Prevented deletion of drivers with existing trip history.
- Moved JWT signing secret from source code to environment configuration.

### Documentation
- Added project architecture and database design diagrams.
- Added root environment configuration template.
- Added MIT license.
