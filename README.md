<h1 align="center">Nodiator</h1>

<div align="center">

Flexible [mediator](https://refactoring.guru/design-patterns/mediator) pattern implementation for [TypeScript](https://www.typescriptlang.org).

[![MIT Licensed](https://img.shields.io/badge/License-MIT-brightgreen)](/LICENSE)
[![NPM version](https://img.shields.io/npm/v/@nodiator/core.svg)](https://www.npmjs.com/package/@nodiator/core)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli)
[![codecov](https://codecov.io/gh/Matii96/nodiator/branch/main/graph/badge.svg?token=RMLVVV7C0O)](https://codecov.io/gh/Matii96/nodiator)
[![Build Status](https://github.com/Matii96/nodiator/workflows/main-build/badge.svg?branch=main)](https://github.com/Matii96/nodiator/actions?workflow=main-build)

</div>

## Table of contents

- [Idea](#idea)
- [Packages](#packages)
- [Examples](#examples)
- [Local development](#local_development)
  - [Building packages](#local_development_building_packages)
  - [Testing](#local_development_testing)
  - [Committing](#local_development_committing)
- [Authors](#authors)
- [License](#license)

## 💡 Idea

<a name="idea"></a>

When application grows in size it becomes more and more complicated to control dataflow between objects / modules. Modifying one of them may lead to unwanted "shotgun surgery" resulting in breaking other features of the application.

Other problem are extra indirect actions like logging or caching moved directly to eg. business parts of code effectively preventing us from easily unplugging any of the middle actions from application.

Nodiator aims to address this problem by providing configurable mediator object serving as a communication hub.

## Packages

<a name="packages"></a>

- [Core](https://github.com/Matii96/nodiator/tree/main/packages/core) - project implementation for vanilla typescript
- [Nest](https://github.com/Matii96/nodiator/tree/main/packages/nest) - nestjs integration

## Examples

<a name="examples"></a>

- [Express + typescript](examples/01-express/README.md)

## Local development

<a name="local_development"></a>

Project uses [yarn workspaces](https://yarnpkg.com/features/workspaces) in combination with [lerna](https://lerna.js.org). To initialize the project run

```bash
yarn
```

### Building packages

<a name="local_development_building_packages"></a>

As project uses typescript for the package to be seen as other packages dependency they need to be built first.

```bash
yarn build
```

### Testing

<a name="local_development_testing"></a>

```bash
yarn lint:staged  # linting staged files
yarn test         # running unit tests for packages changed since HEAD
yarn test:cov     # running unit tests for whole repo with coverage report
yarn test:e2e     # running e2e tests for packages changed since HEAD with packages dependent on them
yarn precommit    # combining lint:staged, test and test:e2e
```

### Committing

<a name="local_development_committing"></a>

The project follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0) standard. To conveniently create commit message use [commitizen](https://commitizen-tools.github.io/commitizen) by typing

```bash
yarn cz
```

## Authors

<a name="authors"></a>

**Mateusz Fonfara**

- Github: [@Matii96](https://github.com/Matii96)
- Medium: [@Matii96](https://medium.com/@matii96)

See also the full list of [contributors](https://github.com/Matii96/nodiator/contributors).

## License

<a name="license"></a>

This project is licensed under the MIT License - see the [LICENSE file](https://github.com/Matii96/nodiator/tree/main/LICENSE) for details.
