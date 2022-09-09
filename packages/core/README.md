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
- [Usage](#usage)
- [Installation](#installation)
- [Quick Start](#quick_start)
- [Messages documentation](#messages)
- [Providers scope](#providers_scope)
- [Logging](#logging)
  - [Logging levels](#logging_levels)
  - [Custom logger](#logging_custom_logger)
  - [Exceptions levels override](#logging_exceptions_levels)
- [License](#license)

## 💡 Idea

<a name="idea"></a>

When application grows in size it becomes more and more complicated to control dataflow between objects / modules. Modifying one of them may lead to unwanted "shotgun surgery" resulting in breaking other features of the application.

Other problem are extra indirect actions like logging or caching moved directly to eg. business parts of code effectively preventing us from easily unplugging any of the middle actions from application.

Nodiator aims to address this problem by providing configurable mediator object serving as a communication hub.

## Usage

<a name="usage"></a>

Mediator handles objects called messages. You can think of them as simple dtos as they role is to transport data in given context. They are then passed to providers - handlers, pipelines and other pieces of code interested in given message.

## Installation

<a name="installation"></a>

```bash
npm i @nodiator/core
# or
yarn add @nodiator/core
```

## Quick Start

<a name="quick_start"></a>

```ts
class ExampleRequest {}
class SomeEvent {}

@RequestHandler(ExampleRequest)
export class ExampleRequestHandler implements IRequestHandler<ExampleRequest, string> {
  async handle(request: ExampleRequest) {
    return 'ok';
  }
}

@EventHandler(SomeEvent)
export class SomeEventHandler implements IEventHandler<SomeEvent> {
  async handle(event: SomeEvent) {
    console.log('SomeEvent handled');
  }
}

const mediator = MediatorFactory.create({ providers: [ExampleRequestHandler, SomeEventHandler] });

console.log(await mediator.request<string>(new ExampleRequest())); // output: ok
await mediator.publish(new SomeEvent()); // output: SomeEvent handled
```

## 📖 Messages documentation

<a name="messages"></a>

Supported types are:

- [Events](https://github.com/Matii96/nodiator/tree/main/packages/core/docs/events.md)
- [Requests](https://github.com/Matii96/nodiator/tree/main/packages/core/docs/requests.md)

## Providers scope

<a name="providers_scope"></a>

Each provider is lazy-created upon it's first call by default.

One that's done the its instance is saved internally for application lifetime. This behaviour can be changed into instatiting provider for each seperate call by setting `scoped` flag in given provider's decorator.

```ts
@RequestHandler({ request: ExampleRequest, scoped: true })
export class ExampleRequestHandler implements IRequestHandler<ExampleRequest, string> {
  ...
}
```

Custom providers instantiator can be defined as mediator configuration as well.

```ts
const mediator = MediatorFactory.create({
  providers: [ExampleRequestHandler, SomeEventHandler],
  providersInstantiator: (ProviderType) => new ProviderType(),
});
```

Above example implementation is identical with call-scoped instatiting.

## Logging

<a name="logging"></a>

Mediator supports built-in logging system which can be easily customized.

In addition to that the mediator object extends RxJS Observable and can be subscribed to. It emits all messages state changes - starting handlers execution, errors etc.

### Levels

<a name="logging_levels"></a>

Mediator supports following levels of logging: `DEBUG`, `INFO`, `WARN`, `ERROR` and `NONE`. The default one is `INFO` and allows all logs to be visible besides those marked as `DEBUG`.

```ts
const mediator = MediatorFactory.create({
  config: () => ({ logs: { level: MediatorLoggingLevels.DEBUG } }),
});
```

Note that `config` property is function called each time configuration data is needed which allows to implement logic to change mediator behaviour without app reload.

### Custom logger

<a name="logging_custom_logger"></a>

By default messages are logged via `console` methods.

```ts
class CustomLogger implements IMediatorLogger {
  debug(msg: string) {
    ...
  }
  info(msg: string) {
    ...
  }
  warn(msg: string) {
    ...
  }
  error(msg: string) {
    ...
  }
}

const mediator = MediatorFactory.create({
  logger: new CustomLogger()
});
```

### Exceptions levels override

<a name="logging_exceptions_levels"></a>

Some exceptions may not necessarily fit into error level. This behavior can be customized via

```ts
const mediator = MediatorFactory.create({
  exceptionsLoggingLevels: {
    [MediatorLoggingLevels.WARN]: [MessageTimeoutException],
  },
});
```

With above configuration all mediator timeout exceptions will be logged as warnings.

## License

<a name="license"></a>

This project is licensed under the MIT License - see the [LICENSE file](https://github.com/Matii96/nodiator/tree/main/LICENSE) for details.
