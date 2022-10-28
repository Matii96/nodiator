# NestJS integration for [Nodiator](https://github.com/Matii96/nodiator)

Utilizes Nest's DI system to manage providers and mediator instances.

## Table of contents

- [Installation](#installation)
- [Quick Start](#quick_start)
  - [Namespaces](#quick_start_namespaces)
  - [Importing mediator module](#quick_start_importing)
    - [Single namespace](#quick_start_importing_single)
    - [Multiple namespaces](#quick_start_importing_multiple)
    - [Async single namespace](#quick_start_importing_async_single)
    - [Async multiple namespaces](#quick_start_importing_async_multiple)
  - [Usage](#quick_start_usage)
- [License](#license)

## Installation

<a name="installation"></a>

```bash
npm i @nodiator/core @nodiator/nest
# or
yarn add @nodiator/core @nodiator/nest
```

## Quick Start

<a name="quick_start"></a>

Messages declaration remain the same as in core implementation.

```ts
// get-all-cats.use-case.ts
export class GetAllCatsUseCase {}

// get-all-cats.use-case.handler.ts
@RequestHandler(GetAllCatsUseCase)
export class GetAllCatsUseCaseHandler implements IRequestHandler<GetAllCatsUseCase, GetAllCatsUseCaseResult> {
  async handle(request: GetAllCatsUseCase) {
    return 'ok';
  }
}
```

### Namespaces

<a name="quick_start_namespaces"></a>

Nest module allows to declare and inject scoped mediators. Providers defined in given namespace are only visible to the mediator injected with same namespace token.

```ts
// cats.controller.ts
@Controller('cats-feeding')
export class CatsFeedingController {
  constructor(@InjectMediator('CATS_FEEDING') private readonly mediator: IMediator) {}

  @Get()
  getAllCats() {
    return firstValueFrom(this.mediator.request<GetAllCatsUseCaseResult>(new GetAllCatsUseCase()));
  }
}

// cats.module.ts
@Module({
  imports: [MediatorModule.forFeature(CatsSubModule, { namespace: 'CATS_FEEDING' })],
  controllers: [CatsFeedingController],
  providers: [GetAllCatsUseCaseHandler],
})
export class CatsFeedingModule {}

// app.module.ts
@Module({
  imports: [MediatorModule.forRoot({ namespace: 'CATS_FEEDING' }), CatsFeedingModule],
})
export class AppModule {}
```

### Importing mediator module

<a name="quick_start_importing"></a>

#### Import for single global namespace

<a name="quick_start_importing_single"></a>

```ts
@Module({
  imports: [MediatorModule.forRoot(), CatsModule],
})
export class AppModule {}
```

#### Import for multiple namespaces

<a name="quick_start_importing_multiple"></a>

```ts
@Module({
  imports: [MediatorModule.forRoot({}, { namespace: 'CATS_FEEDING' } as MediatorNestOptions), CatsModule],
})
export class AppModule {}
```

#### Async import for single global namespace

<a name="quick_start_importing_async_single"></a>

```ts
@Module({
  imports: [MediatorModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService): Promise<MediatorNestOptions> => { ... }
  }), CatsFeedingModule],
})
export class AppModule {}
```

#### Async import for multiple namespaces

<a name="quick_start_importing_async_multiple"></a>

```ts
@Module({
  imports: [MediatorModule.forRootAsync({
    imports: [ConfigModule],
    configurations: [
      { // global namespace
        inject: [ConfigService],
        useFactory: async (config: ConfigService): Promise<MediatorNestOptions> => { ... },
      },
      {
        namespace: 'CATS_FEEDING',
        inject: [ConfigService],
        useFactory: async (config: ConfigService): Promise<MediatorNestOptions> => { ... },
      }
    ]
  }), CatsFeedingModule]
})
export class AppModule {}
```

### Usage

<a name="quick_start_usage"></a>

```ts
// cats.controller.ts
@Controller('cats')
export class CatsController {
  constructor(@InjectMediator() private readonly mediator: IMediator) {}

  @Get()
  getAllCats() {
    return firstValueFrom(this.mediator.request<GetAllCatsUseCaseResult>(new GetAllCatsUseCase()));
  }
}

// cats.module.ts
@Module({
  controllers: [CatsController],
  providers: [GetAllCatsUseCaseHandler],
})
export class CatsModule {}
```

## License

<a name="license"></a>

This project is licensed under the MIT License - see the [LICENSE file](https://github.com/Matii96/nodiator/tree/main/LICENSE) for details.
