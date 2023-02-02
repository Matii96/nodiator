import { ResponseType } from '@nodiator/core';

export class UpdateItemUseCase {
  [ResponseType]: void;
  constructor(readonly id: string, readonly name: string, readonly description: string) {}
}
