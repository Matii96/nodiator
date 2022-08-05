# Mediator + Express + TypeScript example integration

1. Proceed with monorepo installation
2. Run via `npm run start:dev` or `yarn start:dev`
3. Example API is running on localhost:3000

## Available routes:

| Method | Routes               | Payload                                                  | Description           |
| ------ | -------------------- | -------------------------------------------------------- | --------------------- |
| GET    | /history             |                                                          | gets requests history |
| GET    | /items?search=myitem |                                                          | finds all items       |
| GET    | /items/:id           |                                                          | find item by its id   |
| POST   | /items               | {"name": "Item name", "description": "Item description"} | creates new item      |
| PUT    | /items/:id           | {"name": "Item name", "description": "Item description"} | updates existing item |
| DELETE | /items/:id           |                                                          | deletes existing item |
