# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.2.0](https://github.com/Matii96/nodiator/compare/v3.1.1...v3.2.0) (2022-12-30)

### Features

- **core:** removed uuid dependency ([bc2da40](https://github.com/Matii96/nodiator/commit/bc2da40db168ad432b8f6b34e5941b30aa70c841))

# [3.1.0](https://github.com/Matii96/nodiator/compare/v3.0.2...v3.1.0) (2022-12-25)

**Note:** Version bump only for package @nodiator/core

# [3.0.0](https://github.com/Matii96/nodiator/compare/v2.2.1...v3.0.0) (2022-12-19)

### Bug Fixes

- **core:** added missing export ([87618fb](https://github.com/Matii96/nodiator/commit/87618fb0418af7b6849c93110d72fff0393ef126))
- **core:** passing correct providers instances in requests processing bus ([107ea46](https://github.com/Matii96/nodiator/commit/107ea46eeafc82f4829f72cef4c571ae20422e9d))

### Features

- **core:** added extensions manager ([ed8bbf4](https://github.com/Matii96/nodiator/commit/ed8bbf48291754dcdb65235b54f52232cbcabb8e))
- **core:** added startedAt property to messages processing bus ([74c34cb](https://github.com/Matii96/nodiator/commit/74c34cbf340462e9205d0546177c23e437bed918))
- **core:** extracted logger from core to be moved to separate package ([b044b4f](https://github.com/Matii96/nodiator/commit/b044b4fe1ba533ef8042f88f2d7e445bc240d933))
- **core:** mediator messages processing bus remake ([32e306c](https://github.com/Matii96/nodiator/commit/32e306cb9b3bbda4192f968c16387c61d9cf75e4))
- **core:** moved to Symbol data type for mediator metadata ([ae88e65](https://github.com/Matii96/nodiator/commit/ae88e65aa82406325dee7752fc99e6c25727bf4d))
- removed I prefix from interfaces ([f2a1e86](https://github.com/Matii96/nodiator/commit/f2a1e86eaaf59c506a920d6ecdfbd9ee0767304f))

### BREAKING CHANGES

- changed exported interfaces naming
- **core:** New mediator options structure
- **core:** Messages bus as new sub property of mediator object. Bus emits objects with unique
  id, message type and observable which represent message processing states

## [2.2.1](https://github.com/Matii96/nodiator/compare/v2.2.0...v2.2.1) (2022-10-28)

### Bug Fixes

- **core:** outdated documentation update ([a1adb03](https://github.com/Matii96/nodiator/commit/a1adb0394c6a1a6ac4663109a31bddf668c2aa18))

# [2.2.0](https://github.com/Matii96/nodiator/compare/v2.1.1...v2.2.0) (2022-09-11)

### Bug Fixes

- **core:** corrected messages logging typo '}' eg. "(uuid})" ([3110303](https://github.com/Matii96/nodiator/commit/3110303560fd11def4d3b8d706694994dc614f1c))

## [2.1.1](https://github.com/Matii96/nodiator/compare/v2.1.0...v2.1.1) (2022-09-10)

### Bug Fixes

- **core:** move rxjs to peerDependencies ([9702d2e](https://github.com/Matii96/nodiator/commit/9702d2e865d41c69a6993002ccdfeeed10f4a30b))

# [2.1.0](https://github.com/Matii96/nodiator/compare/v2.0.0...v2.1.0) (2022-09-09)

### Bug Fixes

- **core:** invalid config structure correction ([cf50f06](https://github.com/Matii96/nodiator/commit/cf50f06894b3d82c464f61d8d8a475d8d54cb16a))

### Features

- **core:** custom exceptions logging levels ([5267794](https://github.com/Matii96/nodiator/commit/5267794d2773cb9ea5a8561ee01531ee7143255c))
- **core:** separated debug & info logs for messages finalization ([b786b6f](https://github.com/Matii96/nodiator/commit/b786b6f1c71f738f6a14aba95a3766a4af2f4ab2))

# [2.0.0](https://github.com/Matii96/nodiator/compare/v1.1.3...v2.0.0) (2022-09-08)

### Features

- **core:** added compatibility with rxjs to events handlers types ([2712f0b](https://github.com/Matii96/nodiator/commit/2712f0bbdfe8dab6369a4df05550c70192622573))
- **core:** lazy-loaded config ([3d44e9a](https://github.com/Matii96/nodiator/commit/3d44e9a3c2d15a76d0f3036dc00236875cb046f9))
- **core:** moved from promises mediator handling to full rxjs ([294e768](https://github.com/Matii96/nodiator/commit/294e768392592cebd1eecf61012c62a77c7104da))

### BREAKING CHANGES

- **core:** new mediator options structure
- **core:** Requests pipelines are now required to return rxjs observable. Handlers can return
  it but promises are still valid.

## [1.1.3](https://github.com/Matii96/nodiator/compare/v1.1.2...v1.1.3) (2022-08-12)

**Note:** Version bump only for package @nodiator/core

## [1.1.2](https://github.com/Matii96/nodiator/compare/v1.1.1...v1.1.2) (2022-08-12)

**Note:** Version bump only for package @nodiator/core

## [1.1.1](https://github.com/Matii96/nodiator/compare/v1.1.0...v1.1.1) (2022-08-12)

### Bug Fixes

- **precommit:** fixed running tests during precommit ([#3](https://github.com/Matii96/nodiator/issues/3)) ([38f42ca](https://github.com/Matii96/nodiator/commit/38f42cac6b910393f57d42ec1a436027b1a02801))

# 1.1.0 (2022-08-09)

### Bug Fixes

- fixed hyperlinks to sub docs ([684a30e](https://github.com/Matii96/nodiator/commit/684a30e4c6c35d0cf6d0e171ae9147896f06c8d6))

### Features

- project setup ([c3d2d56](https://github.com/Matii96/nodiator/commit/c3d2d56fd23fc795f4bda1d2818f53a94c73b860))
