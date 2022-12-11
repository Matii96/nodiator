import { IMessageProcessing } from '@nodiator/core';

export interface IProcessingObserver {
  init(processing: IMessageProcessing): void;
}
