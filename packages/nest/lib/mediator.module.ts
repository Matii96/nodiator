import { DynamicModule, Module } from '@nestjs/common';
import { Mediator } from '@nodiator/core';
import { MediatorModuleAsyncOptions, MediatorModuleOptions } from './mediator.module.options';

@Module({})
export class MediatorModule {
  static forRoot(options: MediatorModuleOptions = {}): DynamicModule {
    const mediator = new Mediator({ ...options, providers: [] });
    return {
      global: true,
      module: MediatorModule,
      providers: [{ provide: Mediator, useValue: mediator }],
    };
  }

  // static forRootAsync(options: MediatorModuleAsyncOptions): DynamicModule {
  //   return {
  //     global: true,
  //     module: MediatorModule,
  //     imports: options.imports,
  //     providers: [
  //       {
  //         provide: MEDIATOR_MODULE_OPTIONS,
  //         inject: options.inject || [],
  //         useFactory: async (...args: any[]) => this.fillDefaultValues(await options.useFactory(...args)),
  //       },
  //     ]
  //   };
  // }
}
