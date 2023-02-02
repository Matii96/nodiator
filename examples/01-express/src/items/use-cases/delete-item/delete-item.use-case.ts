import { ResponseType } from '@nodiator/core';

export class DeleteItemUseCase {
  [ResponseType]?: void;
  constructor(readonly id: string) {}
}
