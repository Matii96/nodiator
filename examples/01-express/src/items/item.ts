export class Item {
  readonly id: string;
  name: string;
  description: string;

  constructor(data: Item) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
  }
}
