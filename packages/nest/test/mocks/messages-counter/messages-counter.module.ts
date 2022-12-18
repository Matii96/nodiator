import { Module } from '@nestjs/common';
import { MessagesCounterExtension } from './messages-counter.extension';

@Module({
  providers: [MessagesCounterExtension],
  exports: [MessagesCounterExtension],
})
export class MessagesCounterModule {}
