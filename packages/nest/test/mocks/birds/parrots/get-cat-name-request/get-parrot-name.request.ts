import { ResponseType } from '@nodiator/core';

export class GetParrotNameRequest {
  readonly [ResponseType]?: string;
  constructor(readonly name: string) {}
}
