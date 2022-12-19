import { Module } from '@nestjs/common';
import { MediatorModule } from '../../lib';
import { AccessProvider } from './access.provider';
import { CatsModuleMock } from './cats/cats.module.mock';
import { DogsModuleMock } from './dogs/dogs.module.mock';
import { BirdsModuleMock } from './birds/birds.module.mock';
import { MessagesCounterExtension } from './messages-counter/messages-counter.extension';
import { MessagesCounterModule } from './messages-counter/messages-counter.module';

@Module({
  imports: [
    MediatorModule.forRootAsync({
      imports: [MessagesCounterModule],
      inject: [MessagesCounterExtension],
      useFactory: (messagesCounter: MessagesCounterExtension) => ({ extensions: [messagesCounter] }),
    }),
    MessagesCounterModule,
    CatsModuleMock,
    DogsModuleMock,
    BirdsModuleMock,
  ],
  providers: [AccessProvider],
})
export class AppModuleMock {}
