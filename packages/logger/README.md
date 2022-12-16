# Logger extension for [Nodiator](https://github.com/Matii96/nodiator)

Provides low configuration logging and visibility utility for tracking messages execution.

## Table of contents

- [Installation](#installation)
- [Quick Start](#quick_start)
  - [Example output](#quick_start_example_output)
- [Logging levels](#levels)
- [Custom logger](#custom_logger)
- [Exceptions levels override](#exceptions_levels)
- [License](#license)

## Installation

<a name="installation"></a>

```bash
npm i @nodiator/logger
# or
yarn add @nodiator/logger
```

## Quick Start

<a name="quick_start"></a>

```ts
import { LoggerExtension } from '@nodiator/logger';

const mediator = MediatorFactory.create();
mediator.use(new LoggerExtension());
```

### Example output

<a name="quick_start_example_output"></a>

```
[Mediator] Requested GetHistoryUseCase (id=14e8899b-85e4-4936-9852-3933f71dd4dc)
[Mediator]  -- handling GetHistoryUseCase (id=14e8899b-85e4-4936-9852-3933f71dd4dc) with HistoryPipeline
[Mediator]  -- handling GetHistoryUseCase (id=14e8899b-85e4-4936-9852-3933f71dd4dc) with GetHistoryUseCaseHandler
[Mediator]  -- GetHistoryUseCaseHandler responded to GetHistoryUseCase (id=14e8899b-85e4-4936-9852-3933f71dd4dc)
[Mediator]  -- HistoryPipeline responded to GetHistoryUseCase (id=14e8899b-85e4-4936-9852-3933f71dd4dc)
[Mediator]  -- GetHistoryUseCase (id=14e8899b-85e4-4936-9852-3933f71dd4dc) took 0.009s
[Mediator] GetHistoryUseCase (id=14e8899b-85e4-4936-9852-3933f71dd4dc) handled
```

Based on [express example](https://github.com/Matii96/nodiator/tree/main/examples/01-express).

## Levels

<a name="levels"></a>

Extension supports following levels of logging: `DEBUG`, `INFO`, `WARN`, `ERROR` and `NONE`. The default one is `INFO` and allows all logs to be visible besides those marked as `DEBUG`.

```ts
mediator.use(
  new LoggerExtension({
    dynamicOptions: () => ({ level: MediatorLoggingLevels.DEBUG }),
  })
);
```

Note that `dynamicOptions` property is function called each time configuration data is needed which allows to implement logic to change logging behaviour without app reload.

## Custom logger

<a name="custom_logger"></a>

By default messages are logged via `console` methods. This behavior can be overwritten by

```ts
class CustomLogger implements MediatorLogger {
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

mediator.use(
  new LoggerExtension({
    logger: new CustomLogger(),
  })
);
```

## Exceptions levels override

<a name="exceptions_levels"></a>

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
