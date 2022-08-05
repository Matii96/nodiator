# Events

They are semi Fire-and-forget type of messages. All it's handlers are executed simultaneously. At the same time mediator awaits for all handlers processing to be done catching potential exeptions.

## Handlers

```ts
class SomeEvent {}

@EventHandler(SomeEvent)
export class SomeEventHandler implements IEventHandler<SomeEvent> {
  async handle(event: SomeEvent) {}
}

// Handler can be attached to multiple events
@EventHandler(SomeEvent, OtherEvent)
export class SharedHandler implements IEventHandler<SomeEvent | OtherEvent> {
  async handle(event: SomeEvent | OtherEvent) {}
}
```

## Global handlers

In simmilar way handlers for all events can be defined, without passing list of them in a decorator.

```ts
@GlobalEventHandler()
export class EventsGlobalHandler implements IGlobalEventHandler {
  async handle(event: IEvent) {}
}
```

## Usage

```ts
const mediator = MediatorFactory.create({
  providers: [EventsGlobalHandler, SomeEventHandler],
  eventsTimeout: 1000, // Events handling will be terminated after 1s with timeout exception
  eventsHandlingRetriesAttempts: 1, // After failing for any reason each handler will have one more chance to process event
  eventsHandlingRetriesDelay: 1000, // The above will happen with 1s delay
});

await mediator.publish(new SomeEvent());
console.log('SomeEvent handled');
```

Note that `await` can be omitted for full fire-and-forget way of operation.