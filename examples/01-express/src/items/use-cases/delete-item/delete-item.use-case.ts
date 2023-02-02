import { ResponseType } from '@nodiator/core';

export class DeleteItemUseCase {
  readonly [ResponseType]?: void;
  constructor(readonly id: string) {}
}
