# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.1](https://github.com/Matii96/nodiator/compare/v4.0.0...v4.0.1) (2023-02-16)

### Bug Fixes

- **nest:** loading submodules providers before module ones ([7002002](https://github.com/Matii96/nodiator/commit/7002002b267eaac557f45e111e2d3b90d1efa9e6))

# [4.0.0](https://github.com/Matii96/nodiator/compare/v3.2.1...v4.0.0) (2023-02-16)

### Bug Fixes

- **core:** auto response typing adjustments ([23a80dd](https://github.com/Matii96/nodiator/commit/23a80ddc286bda899392c87950b595f6fe5764fc))
- **core:** auto response typing improvements ([f5ea033](https://github.com/Matii96/nodiator/commit/f5ea033f63dac8cc648b30dba4a13b74fe47a7f1))

### Features

- **core:** added option to type responses types in requests definitions ([660096e](https://github.com/Matii96/nodiator/commit/660096e1dd6b41d092161fadba29aa6bb2bf3250))

### BREAKING CHANGES

- **core:** new request mediator method API - returned type is the second generic type

## [3.2.1](https://github.com/Matii96/nodiator/compare/v3.2.0...v3.2.1) (2022-12-30)

### Bug Fixes

- **nest:** tokens explorer wrong type fix ([5e77592](https://github.com/Matii96/nodiator/commit/5e775923e9d7912324c5ba23af7274c9f6e2d3b9))

# [3.2.0](https://github.com/Matii96/nodiator/compare/v3.1.1...v3.2.0) (2022-12-30)

### Bug Fixes

- **nest:** fixed useFactory declaration of providers instances ([2acc13d](https://github.com/Matii96/nodiator/commit/2acc13df50c31ccd2a803548f257d897330bb76d))

### Features

- **core:** removed uuid dependency ([bc2da40](https://github.com/Matii96/nodiator/commit/bc2da40db168ad432b8f6b34e5941b30aa70c841))
- **nodiator-example-express:** removed uuid dependency ([f520188](https://github.com/Matii96/nodiator/commit/f520188e61e01aecfca0b435987e4792959d3492))

## [3.1.1](https://github.com/Matii96/nodiator/compare/v3.1.0...v3.1.1) (2022-12-25)

### Bug Fixes

- **extension-logger:** upgraded core dependency version ([a3cafb8](https://github.com/Matii96/nodiator/commit/a3cafb80fb5fe69cd4635a5aa24066d65368548a))
- **nest:** moved initialization log to post module init ([1a5f6f1](https://github.com/Matii96/nodiator/commit/1a5f6f1ed8a0a596f65dd92d9efd4210de677538))
- **nest:** upgraded core dependency version ([0b75dd8](https://github.com/Matii96/nodiator/commit/0b75dd814238cc15321c0d798baf863a712c17d1))

# [3.1.0](https://github.com/Matii96/nodiator/compare/v3.0.2...v3.1.0) (2022-12-25)

### Features

- **nest:** added mediator initialization log at application startup ([e276fb4](https://github.com/Matii96/nodiator/commit/e276fb44577243c9debf78c82273a3bf827f91a5))
- **nest:** factory options methods made optional ([ddccd9d](https://github.com/Matii96/nodiator/commit/ddccd9db85848c5dcd4405394d3afd0a226f0a1d))

## [3.0.2](https://github.com/Matii96/nodiator/compare/v3.0.1...v3.0.2) (2022-12-20)

### Bug Fixes

- **nest:** removed readonly from module global options inject property ([1dcc0be](https://github.com/Matii96/nodiator/commit/1dcc0be1857c399854f419477d9be3af25ade65a))

## [3.0.1](https://github.com/Matii96/nodiator/compare/v3.0.0...v3.0.1) (2022-12-20)

### Bug Fixes

- **nest:** added missing logger extension integration guide ([1469b99](https://github.com/Matii96/nodiator/commit/1469b996cc279d2b6176cf02fbfdcb65a416bed8))
- **nest:** dynamic options deep override ([1296cc9](https://github.com/Matii96/nodiator/commit/1296cc99b30979bfd5dd0344faba901bf9f85806))

# [3.0.0](https://github.com/Matii96/nodiator/compare/v2.2.1...v3.0.0) (2022-12-19)

### Bug Fixes

- **core:** added missing export ([87618fb](https://github.com/Matii96/nodiator/commit/87618fb0418af7b6849c93110d72fff0393ef126))
- **core:** passing correct providers instances in requests processing bus ([107ea46](https://github.com/Matii96/nodiator/commit/107ea46eeafc82f4829f72cef4c571ae20422e9d))
- **nodiator-example-express:** providers interfaces implementations fix ([f9bd8c6](https://github.com/Matii96/nodiator/commit/f9bd8c612197aff50064fe8d600b7353f03d4f00))

### Features

- **core:** added extensions manager ([ed8bbf4](https://github.com/Matii96/nodiator/commit/ed8bbf48291754dcdb65235b54f52232cbcabb8e))
- **core:** added startedAt property to messages processing bus ([74c34cb](https://github.com/Matii96/nodiator/commit/74c34cbf340462e9205d0546177c23e437bed918))
- **core:** extracted logger from core to be moved to separate package ([b044b4f](https://github.com/Matii96/nodiator/commit/b044b4fe1ba533ef8042f88f2d7e445bc240d933))
- **core:** mediator messages processing bus remake ([32e306c](https://github.com/Matii96/nodiator/commit/32e306cb9b3bbda4192f968c16387c61d9cf75e4))
- **core:** moved to Symbol data type for mediator metadata ([ae88e65](https://github.com/Matii96/nodiator/commit/ae88e65aa82406325dee7752fc99e6c25727bf4d))
- **extension-logger:** logger extension for Nodiator ([41596a5](https://github.com/Matii96/nodiator/commit/41596a597a876d6b38dadd9bee383b502294b1ca))
- **logger:** logger extension for Nodiator ([333f8f4](https://github.com/Matii96/nodiator/commit/333f8f4de9e6e28bd8c2d2cf553c8387eef767a7))
- **nest:** module rework ([2a46ffd](https://github.com/Matii96/nodiator/commit/2a46ffde4db1dd863168e141250aaed5506b8aca))
- **nodiator-example-express:** added logger to mediator instance ([5beedb6](https://github.com/Matii96/nodiator/commit/5beedb6317e1dffacea15d4c32a3bd9a9b3c8763))
- **nodiator-example-express:** adjusted example to new options structure ([fb75b3d](https://github.com/Matii96/nodiator/commit/fb75b3da493bc57c14a93aaa80cd665e8d595902))
- removed I prefix from interfaces ([f2a1e86](https://github.com/Matii96/nodiator/commit/f2a1e86eaaf59c506a920d6ecdfbd9ee0767304f))

### BREAKING CHANGES

- **nest:** forRoot and forFeature interfaces changed. The latter is reponsible for creating
  mediator instance and exporting it whereas forRoot for global configuring options shared by all
  mediators instances
- **extension-logger:** to attach logger to mediator separate package needs to be installed
- changed exported interfaces naming
- **core:** New mediator options structure
- **core:** Messages bus as new sub property of mediator object. Bus emits objects with unique
  id, message type and observable which represent message processing states

## [2.2.1](https://github.com/Matii96/nodiator/compare/v2.2.0...v2.2.1) (2022-10-28)

### Bug Fixes

- **core:** outdated documentation update ([a1adb03](https://github.com/Matii96/nodiator/commit/a1adb0394c6a1a6ac4663109a31bddf668c2aa18))
- **nest:** outdated documentation update ([21d0b7d](https://github.com/Matii96/nodiator/commit/21d0b7d0cde79e9877a09e537f8afde4c3605a97))

# [2.2.0](https://github.com/Matii96/nodiator/compare/v2.1.1...v2.2.0) (2022-09-11)

### Bug Fixes

- **core:** corrected messages logging typo '}' eg. "(uuid})" ([3110303](https://github.com/Matii96/nodiator/commit/3110303560fd11def4d3b8d706694994dc614f1c))

### Features

- **nest:** added MediatorNestOptions to lib exports ([ecde3a3](https://github.com/Matii96/nodiator/commit/ecde3a3ec7d4ec681be5ee607cc834c1b299f735))

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
- **nest:** async mediator module registration ([8e8654e](https://github.com/Matii96/nodiator/commit/8e8654ede473c611ce825de3ebd01b8c33f1d454))
- **nest:** compatibility with core ^2.0.0 ([3f882e1](https://github.com/Matii96/nodiator/commit/3f882e1371650780cbb72ca77ae6e3690b94392f))

### Reverts

- Revert "ci(pr-push): saving coverage output" ([75af00a](https://github.com/Matii96/nodiator/commit/75af00abe7d9a114c015dd39488e04c4d1fedfc6))

### BREAKING CHANGES

- **core:** new mediator options structure
- **core:** Requests pipelines are now required to return rxjs observable. Handlers can return
  it but promises are still valid.

## [1.1.3](https://github.com/Matii96/nodiator/compare/v1.1.2...v1.1.3) (2022-08-12)

**Note:** Version bump only for package nodiator

## [1.1.2](https://github.com/Matii96/nodiator/compare/v1.1.1...v1.1.2) (2022-08-12)

### Bug Fixes

- **nest:** changed peer dependency of nodiator core to ^1.0.0 ([4af3a3c](https://github.com/Matii96/nodiator/commit/4af3a3ca1105acea6a3cbda57cd27ce5229bf9b9))

## [1.1.1](https://github.com/Matii96/nodiator/compare/v1.1.0...v1.1.1) (2022-08-12)

### Bug Fixes

- **precommit:** fixed running tests during precommit ([#3](https://github.com/Matii96/nodiator/issues/3)) ([38f42ca](https://github.com/Matii96/nodiator/commit/38f42cac6b910393f57d42ec1a436027b1a02801))

# 1.1.0 (2022-08-09)

### Bug Fixes

- fixed hyperlinks to sub docs ([684a30e](https://github.com/Matii96/nodiator/commit/684a30e4c6c35d0cf6d0e171ae9147896f06c8d6))
- root README typo fix ([808f7be](https://github.com/Matii96/nodiator/commit/808f7be2160b0ddd9bff45a6019d4a27e6d87e47))

### Features

- project setup ([c3d2d56](https://github.com/Matii96/nodiator/commit/c3d2d56fd23fc795f4bda1d2818f53a94c73b860))
