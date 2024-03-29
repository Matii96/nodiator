# Requests

They work in synchronous way returning response. Thus each request may only have one handler. They can be used to implement simple Use-case or CQRS patterns.

Handling is deferred until first subscription to the response stream.

## Table of contents

- [Handlers](#handlers)
  - [Response typing](#handlers_response_typing)
- [Pipelines](#pipelines)
- [Global pipelines](#global_pipelines)
- [Usage](#usage)
- [Execution flow](#execution_flow)

## Handlers

<a name="handlers"></a>

```ts
class ExampleRequest {}

@RequestHandler(ExampleRequest)
export class ExampleRequestHandler implements IRequestHandler<ExampleRequest> {
  async handle(request: ExampleRequest) {
    return 'ok';
  }
}
```

### Response typing (optional)

<a name="handlers_response_typing"></a>

Binding response type allows to auto-type result of executing given request. It can be done via `ResponseType` attribute.

```ts
class ExampleRequest {
  [ResponseType]?: string;
}
```

## Pipelines

<a name="pipelines"></a>

A middleware for requests. They allow to execute some pre or post actions for given request handling.

In addition to request object itself a `handle` method receives `next` grip which wraps next pipeline or handler observable which has deferred execution until subscribed to.

```ts
@RequestPipeline(ExampleRequest)
export class ExampleRequestPipeline implements IRequestPipeline<ExampleRequest, string> {
  handle(request: ExampleRequest, next: Observable<string>) {
    console.log(`Starting to handle ${request.constructor.name}`);
    return next.pipe(
      finalize(() => console.log(`Finished ${request.constructor.name} handling`))
    );
  }
}

// Pipelines unlike handlers can be attached to many requests types
@RequestPipeline(ExampleRequest, OtherExampleRequest)
export class ExampleRequestPipeline implements IRequestPipeline<Request, string> {
  ...
}
```

## Global pipelines

<a name="global_pipelines"></a>

Similarly to events global handlers pipelines can be used globally eg. for caching.

```ts
@GlobalRequestPipeline()
export class ExampleGlobalRequestPipeline implements IGlobalRequestPipeline {
  handle(request: ExampleRequest, next: Observable<unknown>) {
    console.log(`Accepting request ${request.constructor.name}`);
    return next.pipe(finalize(() => console.log(`Responding to ${request.constructor.name}`)));
  }
}
```

## Usage

<a name="usage"></a>

```ts
const mediator = MediatorFactory.create({
  providers: [GlobalRequestPipeline, RequestPipeline, RequestHandler],
  dynamicOptions: () => ({ requests: { timeout: 1000 } }), // Requests handling will be terminated after 1s with timeout exception
});

console.log(await firstValueFrom(mediator.request(new ExampleRequest())));
// Output:
// Accepting request ExampleRequest
// Starting to handle ExampleRequest
// Finished ExampleRequest handling
// Responding to ExampleRequest
// ok
```

## Execution flow

<a name="execution_flow"></a>

<div align="center">
  <img src="assets/requests-handling.svg" alt="Execution flow"/>
</div>
