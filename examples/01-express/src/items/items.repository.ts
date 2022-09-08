import { Item } from './item';

export class ItemsRepository {
  private static readonly _items: Item[] = [];

  static findById(id: string) {
    return this._items.find((item) => item.id === id);
  }

  static findAll(search?: string) {
    if (!search) return this._items;
    const pattern = new RegExp(search, 'i');
    return this._items.filter((item) => Object.values(item).some((property) => property.toString().match(pattern)));
  }

  static create(item: Item) {
    this._items.push(item);
  }

  static update(item: Item) {
    const { id, ...data } = item;
    const idx = this._items.findIndex((existingItem) => existingItem.id === id);
    if (idx === -1) return false;
    this._items[idx].name = data.name;
    this._items[idx].description = data.description;
    return true;
  }

  static remove(id: string) {
    const idx = this._items.findIndex((item) => item.id === id);
    if (idx === -1) return false;
    this._items.splice(idx, 1);
    return true;
  }
}
