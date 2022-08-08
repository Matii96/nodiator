<h1 align="center">Nodiator</h1>

<div align="center">

Flexible [mediator](https://refactoring.guru/design-patterns/mediator) pattern implementation for [Node.js](https://nodejs.org).

[![MIT Licensed](https://img.shields.io/badge/License-MIT-brightgreen)](/LICENSE)
[![NPM version](https://img.shields.io/npm/v/@nodiator/core.svg)](https://www.npmjs.com/package/@nodiator/core)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli)
[![Build Status](https://github.com/Matii96/nodiator/workflows/main-push/badge.svg?branch=main)](https://github.com/Matii96/nodiator/actions?workflow=main-push)

</div>

## 💡 Idea

When application grows in size it becomes more and more complicated to control dataflow between objects / modules. Modifying one of them may lead to unwanted "shotgun surgery" resulting in breaking other features of the application.

Other problem are extra indirect actions like logging or caching moved directly to eg. business parts of code effectively preventing us from easily unplugging any of the middle actions from application.

Nodiator aims to address this problem by providing configurable mediator object serving as a communication hub.

## Usage

Mediator handles objects called messages. You can think of them as simple dtos as they role is to transport data in given context. They are then passed to providers - handlers, pipelines and other pieces of code interested in given message.

## Installation

```bash
npm i @nodiator/core
# or
yarn add @nodiator/core
```

## Quick Start

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

Supported types are:

- [Events](https://github.com/Matii96/nodiator/tree/main/packages/core/docs/events.md)
- [Requests](https://github.com/Matii96/nodiator/tree/main/packages/core/docs/requests.md)

## Providers scope

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

Mediator supports following levels of logging: `DEBUG`, `INFO`, `WARN`, `ERROR` and `NONE`. The default one is `INFO` and allows all logs to be visible besides those marked as `DEBUG`. They are logged via `console` methods.

Both of those behaviours can be modified in the mediator configuration.

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
  providers: [ExampleRequestHandler, SomeEventHandler],
  logger: new CustomLogger()
  loggingLevel: 'DEBUG',
});
```

In addition to that the mediator object extends RxJS Observable and can be subscribed to. It emits all messages state changes - starting handlers execution, errors etc.

## License

This project is licensed under the MIT License - see the [LICENSE file](https://github.com/Matii96/nodiator/LICENSE) for details.
