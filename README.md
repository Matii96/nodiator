<h1 align="center">Nodiator</h1>

<div align="center">

Flexible [mediator](https://refactoring.guru/design-patterns/mediator) pattern implementation for [Node.js](https://nodejs.org).

[![MIT Licensed](https://img.shields.io/badge/License-MIT-brightgreen)](/LICENSE) ![ci](https://github.com/Matii96/nodiator/workflows/Release/badge.svg)

</div>

## 💡 Idea

When application grows in size it becomes more and more complicated to control dataflow between objects / modules. Modifying one of them may lead to unwanted "shotgun surgery" resulting in breaking other features of the application.

Other problem are extra indirect actions like logging or caching moved directly to eg. business parts of code effectively preventing us from easily unplugging any of the middle actions from application.

Nodiator aims to address this problem by providing configurable mediator object serving as a communication hub.

## Packages

- [Core](https://github.com/Matii96/nodiator/packages/core/README.md) - project implementation for vanilla node.js
- [Nest](https://github.com/Matii96/nodiator/packages/nest/README.md) - nestjs integration

## Examples

- [Express + typescript](examples/01-express/README.md)

## Local development

```bash
npm i
# or
yarn install
```

```bash
# symlink packages
npm run setup
```

## Authors

**Mateusz Fonfara**

- Github: [@Matii96](https://github.com/Matii96)
- Medium: [@Matii96](https://medium.com/@matii96)

See also the full list of [contributors](https://github.com/Matii96/nodiator/contributors).

## License

This project is licensed under the MIT License - see the [LICENSE file](https://github.com/Matii96/nodiator/LICENSE) for details.
