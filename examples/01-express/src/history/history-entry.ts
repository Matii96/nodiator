import { Message } from '@nodiator/core';

interface HistoryEntryOptions {
  message: Message;
  executionTime: number;
  timestamp: Date;
}

export class HistoryEntry {
  message: string;
  payload: Message;
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
