import { HistoryEntry } from './history-entry';

export class HistoryRepository {
  private static readonly _history: HistoryEntry[] = [];

  static getAll() {
    return this._history;
  }

  static register(entry: HistoryEntry) {
    this._history.unshift(entry);
  }
}
