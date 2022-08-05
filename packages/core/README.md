<h1 align="center">Nodiator</h1>

<div align="center">

Flexible [mediator](https://refactoring.guru/design-patterns/mediator) pattern implementation for [Node.js](https://nodejs.org).

[![MIT Licensed](https://img.shields.io/badge/License-MIT-brightgreen)](/LICENSE) ![ci](https://github.com/Matii96/nodiator/workflows/Release/badge.svg)

</div>

## 💡 Idea

When application grows in size it becomes more and more complicated to control dataflow between objects / modules. Modifying one of them may lead to unwanted "shotgun surgery" resulting in breaking other features of the application.

Other problem are extra indirect actions like logging or caching moved directly to eg. business parts of code effectively preventing us from easily unplugging any of the middle actions from application.

Nodiator aims to address this problem by providing configurable mediator object serving as a communication hub.

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

## ⚙️ Approach

When mediator is initialized then it can handle objects called messages. You can think of them as simple dtos as they role is to transport data in given context. They are then passed to providers - handlers, pipelines and other pieces of code interested in given message.

## Messages

How the mediator will behave depends upon type of message. Supported types are:

- [Events](docs/events)
- [Requests](docs/requests)

## Providers scope

todo

## 📖 Logging

todo

## Contributing

Contributions, issues and feature requests are welcome. Please read
[CONTRIBUTING.md](CONTRIBUTING.md)
for details on the process for submitting pull requests to us.

## Authors

**Mateusz Fonfara**

- Github: [@Matii96](https://github.com/Matii96)
- Medium: [@Matii96](https://medium.com/@matii96)

See also the full list of [contributors](https://github.com/Matii96/nodiator/contributors).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE file](LICENSE) for details.
