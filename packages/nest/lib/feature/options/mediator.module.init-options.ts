export interface MediatorModuleInitOptions {
  /**
   * Identifies mediator instance by custom namespace. To inject mediator use `@InjectMediator('namespace')`.
   */
  readonly namespace?: string | symbol;
}
