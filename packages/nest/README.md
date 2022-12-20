# NestJS integration for [Nodiator](https://github.com/Matii96/nodiator)

Utilizes Nest's DI system to manage providers and mediator instances.

## Table of contents

- [Installation](#installation)
- [Global Configuration](#global_configuration)
- [Usage](#usage)
  - [Exporting Mediators](#usage_exporting_mediators)
  - [Custom Namespaces](#usage_custom_namespaces)
- [Logger](#logger)
- [License](#license)

## Installation

<a name="installation"></a>

```bash
npm i @nodiator/core @nodiator/nest
# or
yarn add @nodiator/core @nodiator/nest
```

## Global Configuration

<a name="global_configuration"></a>

Nest module allows to manage multiple instances of mediators. Configuration shared by all of them can me defined via

```ts
// app.module.ts
import { MediatorModule } from '@nodiator/nest';

@Module({
  imports: [
    MediatorModule.forRoot({
      extensions: [...],
      dynamicOptions: () => ({
        requests: { timeout: 1000 },
      }),
    }),
    CatsModule,
  ],
})
export class AppModule {}
```

## Usage

<a name="usage"></a>

```ts
// cats.controller.ts
import { Mediator } from '@nodiator/nest';

@Controller('cats')
export class CatsController {
  constructor(@InjectMediator() private readonly mediator: Mediator) {}

  @Get()
  getAllCats() {
    return firstValueFrom(this.mediator.request<GetAllCatsUseCaseResult>(new GetAllCatsUseCase()));
  }
}
```

```ts
// cats.module.ts
import { MediatorModule } from '@nodiator/nest';

@Module({
  imports: [
    MediatorModule.forFeature(CatsModule, {
      extensions: [...],
      dynamicOptions: () => ({
        requests: { timeout: 1000 },
      }),
    }),
  ],
  providers: [GetAllCatsUseCaseHandler],
  controllers: [CatsController],
})
export class CatsModule {}
```

Mediator module resolves all providers available in the scope of given module.

### Exporting Mediators

<a name="usage_exporting_mediators"></a>

Above example shows how to inject local module's mediator. To access instance from another module use

```ts
// dogs.module.ts
import { MediatorModule } from '@nodiator/nest';

@Module({
  imports: [MediatorModule.forFeature(DogsModule)],
  exports: [MediatorModule], // export configured dogs mediator
})
export class DogsModule {}
```

```ts
// cats.module.ts
import { MediatorModule } from '@nodiator/nest';

@Module({
  imports: [
    MediatorModule.forFeature(CatsModule),
    DogsModule, // import dogs mediator into cats module
  ],
  providers: [GetAllCatsUseCaseHandler],
  controllers: [CatsController],
})
export class CatsModule {}
```

```ts
import { Mediator } from '@nodiator/nest';

@Controller('cats')
export class CatsController {
  constructor(
    @InjectMediator() private readonly catsMediator: Mediator,
    @InjectMediator(DogsModule) private readonly dogsMediator: Mediator
  ) {}

  ...
}
```

### Custom Namespaces

<a name="usage_custom_namespaces"></a>

Mediators can be provided and injected using custom string identifier. It' useful for creating abstraction from module imports dependencies.

```ts
// cats.module.ts
import { MediatorModule } from '@nodiator/nest';

@Module({
  imports: [
    MediatorModule.forFeature(CatsModule, {
      namespace: 'CATS_NAMESPACE',
      extensions: [...],
      dynamicOptions: () => ({
        requests: { timeout: 1000 },
      }),
    }),
  ],
  providers: [GetAllCatsUseCaseHandler],
  controllers: [CatsController],
})
export class CatsModule {}
```

```ts
// cats.controller.ts
import { Mediator } from '@nodiator/nest';

@Controller('cats')
export class CatsController {
  constructor(@InjectMediator('CATS_NAMESPACE') private readonly mediator: Mediator) {}

  @Get()
  getAllCats() {
    return firstValueFrom(this.mediator.request<GetAllCatsUseCaseResult>(new GetAllCatsUseCase()));
  }
}
```

## Logger

<a name="logger"></a>

The package exports logger integration if nest module is used in combination with logger extension.

```ts
// app.module.ts
import { LoggerExtension } from '@nodiator/extension-logger';
import { MediatorModule, NestMediatorLogger } from '@nodiator/nest';

@Module({
  imports: [
    MediatorModule.forRoot({
      extensions: [new LoggerExtension({ logger: new NestMediatorLogger() })],
    }),
    CatsModule,
  ],
})
export class AppModule {}
```

## License

<a name="license"></a>

This project is licensed under the MIT License - see the [LICENSE file](https://github.com/Matii96/nodiator/tree/main/LICENSE) for details.
