<h1 align="center">Nodiator</h1>

<div align="center">

Flexible [mediator](https://refactoring.guru/design-patterns/mediator) pattern implementation for [Node.js](https://nodejs.org).

[![MIT Licensed](https://img.shields.io/badge/License-MIT-brightgreen)](/LICENSE) ![ci](https://github.com/Matii96/nodiator/workflows/Release/badge.svg)

</div>

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

const mediator = MediatorFactory.create({ providers: [ExampleRequestHandler] });

console.log(await mediator.request<string>(new ExampleRequest())); // output: ok
await mediator.publish(new SomeEvent()); // output: SomeEvent handled
```

## Messages

How the mediator will behave depends upon type of message. Supported types are:

- [Events](https://github.com/Matii96/nodiator/packages/core/docs/events.md)
- [Requests](https://github.com/Matii96/nodiator/packages/core/docs/requests.md)

## Providers scope

todo

## Logging

todo

## License

This project is licensed under the MIT License - see the [LICENSE file](https://github.com/Matii96/nodiator/LICENSE) for details.
