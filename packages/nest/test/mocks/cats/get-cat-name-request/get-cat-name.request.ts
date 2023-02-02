import { ResponseType } from '@nodiator/core';
export class GetCatNameRequest {
  readonly [ResponseType]?: string;
  constructor(readonly name: string) {}
}
