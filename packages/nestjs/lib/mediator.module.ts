import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class MediatorModule {
  static forRoot(options: MediatorModuleOptions): DynamicModule {
    return {
      global: true,
      module: MediatorModule,
      providers: [{ provide: MEDIATOR_MODULE_OPTIONS, useValue: this.fillDefaultValues(options) }],
      exports: [MEDIATOR_MODULE_OPTIONS],
    };
  }

  static forRootAsync(options: MediatorModuleAsyncOptions): DynamicModule {
    return {
      global: true,
      module: MediatorModule,
      imports: options.imports,
      providers: [
        {
          provide: MEDIATOR_MODULE_OPTIONS,
          inject: options.inject || [],
          useFactory: async (...args: any[]) => this.fillDefaultValues(await options.useFactory(...args)),
        },
      ],
      exports: [MEDIATOR_MODULE_OPTIONS],
    };
  }

  private static fillDefaultValues(options: MediatorModuleOptions = {}): MediatorModuleOptions {
    return {
      eventsHandlingRetriesAttempts: 1,
      eventsHandlingRetriesDelay: 0,
      ...options,
    };
  }
}
