# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.2.0](https://github.com/Matii96/nodiator/compare/v2.1.1...v2.2.0) (2022-09-11)


### Bug Fixes

* **core:** corrected  messages logging typo '}' eg. "(uuid})" ([3110303](https://github.com/Matii96/nodiator/commit/3110303560fd11def4d3b8d706694994dc614f1c))





## [2.1.1](https://github.com/Matii96/nodiator/compare/v2.1.0...v2.1.1) (2022-09-10)


### Bug Fixes

* **core:** move rxjs to peerDependencies ([9702d2e](https://github.com/Matii96/nodiator/commit/9702d2e865d41c69a6993002ccdfeeed10f4a30b))





# [2.1.0](https://github.com/Matii96/nodiator/compare/v2.0.0...v2.1.0) (2022-09-09)


### Bug Fixes

* **core:** invalid config structure correction ([cf50f06](https://github.com/Matii96/nodiator/commit/cf50f06894b3d82c464f61d8d8a475d8d54cb16a))


### Features

* **core:** custom exceptions logging levels ([5267794](https://github.com/Matii96/nodiator/commit/5267794d2773cb9ea5a8561ee01531ee7143255c))
* **core:** separated debug & info logs for messages finalization ([b786b6f](https://github.com/Matii96/nodiator/commit/b786b6f1c71f738f6a14aba95a3766a4af2f4ab2))





# [2.0.0](https://github.com/Matii96/nodiator/compare/v1.1.3...v2.0.0) (2022-09-08)


### Features

* **core:** added compatibility with rxjs to events handlers types ([2712f0b](https://github.com/Matii96/nodiator/commit/2712f0bbdfe8dab6369a4df05550c70192622573))
* **core:** lazy-loaded config ([3d44e9a](https://github.com/Matii96/nodiator/commit/3d44e9a3c2d15a76d0f3036dc00236875cb046f9))
* **core:** moved from promises mediator handling to full rxjs ([294e768](https://github.com/Matii96/nodiator/commit/294e768392592cebd1eecf61012c62a77c7104da))


### BREAKING CHANGES

* **core:** new mediator options structure
* **core:** Requests pipelines are now required to return rxjs observable. Handlers can return
it but promises are still valid.





## [1.1.3](https://github.com/Matii96/nodiator/compare/v1.1.2...v1.1.3) (2022-08-12)

**Note:** Version bump only for package @nodiator/core





## [1.1.2](https://github.com/Matii96/nodiator/compare/v1.1.1...v1.1.2) (2022-08-12)

**Note:** Version bump only for package @nodiator/core





## [1.1.1](https://github.com/Matii96/nodiator/compare/v1.1.0...v1.1.1) (2022-08-12)


### Bug Fixes

* **precommit:** fixed running tests during precommit ([#3](https://github.com/Matii96/nodiator/issues/3)) ([38f42ca](https://github.com/Matii96/nodiator/commit/38f42cac6b910393f57d42ec1a436027b1a02801))





# 1.1.0 (2022-08-09)


### Bug Fixes

* fixed hyperlinks to sub docs ([684a30e](https://github.com/Matii96/nodiator/commit/684a30e4c6c35d0cf6d0e171ae9147896f06c8d6))


### Features

* project setup ([c3d2d56](https://github.com/Matii96/nodiator/commit/c3d2d56fd23fc795f4bda1d2818f53a94c73b860))
