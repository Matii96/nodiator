import { Injectable, Module } from '@nestjs/common';

@Injectable()
export class ProviderMock {}

@Injectable()
export class NestedProviderMock {}

@Module({
  providers: [NestedProviderMock],
  exports: [NestedProviderMock],
})
export class SubmoduleMock {}

@Module({
  imports: [SubmoduleMock],
  providers: [ProviderMock],
})
export class ModuleMock {}
