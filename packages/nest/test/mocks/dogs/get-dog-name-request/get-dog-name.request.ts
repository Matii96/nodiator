import { ResponseType } from '@nodiator/core';

export class GetDogNameRequest {
  [ResponseType]?: string;
  constructor(readonly name: string) {}
}
