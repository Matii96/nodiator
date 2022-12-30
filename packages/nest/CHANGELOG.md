# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.2.0](https://github.com/Matii96/nodiator/compare/v3.1.1...v3.2.0) (2022-12-30)

### Bug Fixes

- **nest:** fixed useFactory declaration of providers instances ([2acc13d](https://github.com/Matii96/nodiator/commit/2acc13df50c31ccd2a803548f257d897330bb76d))

## [3.1.1](https://github.com/Matii96/nodiator/compare/v3.1.0...v3.1.1) (2022-12-25)

### Bug Fixes

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

### Features

- **core:** added extensions manager ([ed8bbf4](https://github.com/Matii96/nodiator/commit/ed8bbf48291754dcdb65235b54f52232cbcabb8e))
- **nest:** module rework ([2a46ffd](https://github.com/Matii96/nodiator/commit/2a46ffde4db1dd863168e141250aaed5506b8aca))
- removed I prefix from interfaces ([f2a1e86](https://github.com/Matii96/nodiator/commit/f2a1e86eaaf59c506a920d6ecdfbd9ee0767304f))

### BREAKING CHANGES

- **nest:** forRoot and forFeature interfaces changed. The latter is reponsible for creating
  mediator instance and exporting it whereas forRoot for global configuring options shared by all
  mediators instances
- changed exported interfaces naming

## [2.2.1](https://github.com/Matii96/nodiator/compare/v2.2.0...v2.2.1) (2022-10-28)

### Bug Fixes

- **nest:** outdated documentation update ([21d0b7d](https://github.com/Matii96/nodiator/commit/21d0b7d0cde79e9877a09e537f8afde4c3605a97))

# [2.2.0](https://github.com/Matii96/nodiator/compare/v2.1.1...v2.2.0) (2022-09-11)

### Features

- **nest:** added MediatorNestOptions to lib exports ([ecde3a3](https://github.com/Matii96/nodiator/commit/ecde3a3ec7d4ec681be5ee607cc834c1b299f735))

## [2.1.1](https://github.com/Matii96/nodiator/compare/v2.1.0...v2.1.1) (2022-09-10)

**Note:** Version bump only for package @nodiator/nest

# [2.1.0](https://github.com/Matii96/nodiator/compare/v2.0.0...v2.1.0) (2022-09-09)

### Bug Fixes

- **core:** invalid config structure correction ([cf50f06](https://github.com/Matii96/nodiator/commit/cf50f06894b3d82c464f61d8d8a475d8d54cb16a))

# [2.0.0](https://github.com/Matii96/nodiator/compare/v1.1.3...v2.0.0) (2022-09-08)

### Features

- **nest:** async mediator module registration ([8e8654e](https://github.com/Matii96/nodiator/commit/8e8654ede473c611ce825de3ebd01b8c33f1d454))
- **nest:** compatibility with core ^2.0.0 ([3f882e1](https://github.com/Matii96/nodiator/commit/3f882e1371650780cbb72ca77ae6e3690b94392f))

## [1.1.3](https://github.com/Matii96/nodiator/compare/v1.1.2...v1.1.3) (2022-08-12)

**Note:** Version bump only for package @nodiator/nest

## [1.1.2](https://github.com/Matii96/nodiator/compare/v1.1.1...v1.1.2) (2022-08-12)

### Bug Fixes

- **nest:** changed peer dependency of nodiator core to ^1.0.0 ([4af3a3c](https://github.com/Matii96/nodiator/commit/4af3a3ca1105acea6a3cbda57cd27ce5229bf9b9))

## [1.1.1](https://github.com/Matii96/nodiator/compare/v1.1.0...v1.1.1) (2022-08-12)

### Bug Fixes

- **precommit:** fixed running tests during precommit ([#3](https://github.com/Matii96/nodiator/issues/3)) ([38f42ca](https://github.com/Matii96/nodiator/commit/38f42cac6b910393f57d42ec1a436027b1a02801))

# 1.1.0 (2022-08-09)

### Features

- project setup ([c3d2d56](https://github.com/Matii96/nodiator/commit/c3d2d56fd23fc795f4bda1d2818f53a94c73b860))
