import { Module } from '@nestjs/common';
import { MediatorModule } from '../../../lib';
import { DOGS_NAMESPACE } from './constants';
import { DogsMediatorModuleOptionsFactory } from './dogs.mediator.module.options-factory';
import { GetDogNameRequestHandler } from './get-dog-name-request/get-dog-name.request.handler';

@Module({
  imports: [
    MediatorModule.forFeatureAsync(DogsModuleMock, {
      namespace: DOGS_NAMESPACE,
      useClass: DogsMediatorModuleOptionsFactory,
    }),
  ],
  providers: [{ provide: GetDogNameRequestHandler, useFactory: () => new GetDogNameRequestHandler() }],
  exports: [MediatorModule],
})
export class DogsModuleMock {}
