import { Module } from '@nestjs/common';
import { MediatorModule } from '../../lib';
import { Namespaces } from './namespaces.enum';
import { TestRequestHandler } from './messages.mocks';
import { AccessProvider } from './access.provider';

@Module({
  imports: [MediatorModule.forFeature(SubModuleA, { namespace: Namespaces.NAMESPACE1 })],
  providers: [TestRequestHandler],
})
export class SubModuleA {}

@Module({
  imports: [MediatorModule.forFeature(SubModuleB, { namespace: Namespaces.NAMESPACE2 })],
})
export class SubModuleB {}

@Module({
  providers: [AccessProvider],
})
export class SubModuleC {}
