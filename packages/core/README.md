<h1 align="center">Nodiator</h1>

<div align="center">

Flexible [mediator](https://refactoring.guru/design-patterns/mediator) pattern implementation for [Node.js](https://nodejs.org).

[![MIT Licensed](https://img.shields.io/badge/License-MIT-brightgreen)](/LICENSE) ![ci](https://github.com/Matii96/nodiator/workflows/Release/badge.svg)

</div>

## 💡 Idea

When application grows in size it becomes more and more complicated task to control dataflow between objects / modules. Modifying one of them may lead to unwanted "shotgun surgery" resulting in breaking other features of the application.

Other problem are extra indirect actions like logging or caching moved directly to eg. business parts of code effectively preventing us from easily unplugging off one of the middle actions from the application.

Nodiator aims to address this problem by providing configurable mediator object serving as a communication hub.

## Installation

```bash
npm i @nodiator/core
```

or

```bash
yarn add @nodiator/core
```

## Quick Start

todo
