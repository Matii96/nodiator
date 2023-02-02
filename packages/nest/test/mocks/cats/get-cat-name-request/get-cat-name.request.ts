import { ResponseType } from '@nodiator/core';
export class GetCatNameRequest {
  [ResponseType]?: string;
  constructor(readonly name: string) {}
}
