import { IMessage } from '@nodiator/core';

interface HistoryEntryOptions {
  message: IMessage;
  executionTime: number;
  timestamp: Date;
}

export class HistoryEntry {
  message: string;
  payload: IMessage;
  executionTime: number;
  timestamp: Date;

  static fromMessage(data: HistoryEntryOptions) {
    const entry = new HistoryEntry();
    entry.message = data.message.constructor.name;
    entry.payload = data.message;
    entry.executionTime = data.executionTime;
    entry.timestamp = data.timestamp;
    return entry;
  }
}
