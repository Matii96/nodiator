import { ResponseType } from '@nodiator/core';

export class GetDogNameRequest {
  readonly [ResponseType]?: string;
  constructor(readonly name: string) {}
}
