# NestJS integration for [Nodiator](https://github.com/Matii96/nodiator)

Utilizes Nest's DI system to manage providers and mediator instances.

## Installation

```bash
npm i @nodiator/core @nodiator/nest
# or
yarn add @nodiator/core @nodiator/nest
```

## Quick Start

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

```ts
// cats.controller.ts
@Controller('cats')
export class CatsController {
  constructor(@InjectMediator() private readonly mediator: IMediator) {}

  @Get()
  getAllCats() {
    return this.mediator.request<GetAllCatsUseCaseResult>(new GetAllCatsUseCase());
  }
}

// cats.module.ts
@Module({
  controllers: [CatsController],
  providers: [GetAllCatsUseCaseHandler],
})
export class CatsModule {}

// app.module.ts
@Module({
  imports: [MediatorModule.forRoot(), CatsModule],
})
export class AppModule {}
```

### Namespaces

Nest module allows to declare and inject scoped mediators. Providers defined in given namespace are only visible to the mediator injected with same namespace token. It allows configuration in which same request may have different handlers. For examples request `GetAllCatsUseCase` may have different return values in `Feeding` and `Grooming` modules.

```ts
// cats.controller.ts
@Controller('cats-feeding')
export class CatsFeedingController {
  constructor(@InjectMediator('CATS_FEEDING') private readonly mediator: IMediator) {}

  @Get()
  getAllCats() {
    return this.mediator.request<GetAllCatsUseCaseResult>(new GetAllCatsUseCase());
  }
}

// cats.module.ts
@Module({
  imports: [MediatorModule.forFeature(CatsFeedingModule, { 'CATS_FEEDING' })],
  controllers: [CatsFeedingController],
  providers: [GetAllCatsUseCaseHandler],
})
export class CatsFeedingModule {}

// app.module.ts
@Module({
  imports: [MediatorModule.forRoot(), CatsFeedingModule],
})
export class AppModule {}
```

## License

This project is licensed under the MIT License - see the [LICENSE file](https://github.com/Matii96/nodiator/LICENSE) for details.
