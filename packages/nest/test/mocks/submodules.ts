import { Module } from '@nestjs/common';
import { MediatorModule } from '../../lib';
import { Namespaces } from './namespaces.enum';
import { TestRequestHandler } from './messages.mocks';
import { AccessProvider } from './access.provider';

@Module({
  imports: [MediatorModule.forFeature(CatsSubModule, { namespace: Namespaces.CATS })],
  providers: [TestRequestHandler],
})
export class CatsSubModule {}

@Module({
  imports: [MediatorModule.forFeature(DogsSubModule, { namespace: Namespaces.DOGS })],
})
export class DogsSubModule {}

@Module({
  providers: [AccessProvider],
})
export class AnimalsSubModule {}
