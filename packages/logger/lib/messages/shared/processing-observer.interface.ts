import { MessageProcessing } from '@nodiator/core';

export interface ProcessingObserver {
  init(processing: MessageProcessing): void;
}
