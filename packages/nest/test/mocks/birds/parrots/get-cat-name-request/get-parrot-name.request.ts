import { ResponseType } from '@nodiator/core';

export class GetParrotNameRequest {
  [ResponseType]?: string;
  constructor(readonly name: string) {}
}
