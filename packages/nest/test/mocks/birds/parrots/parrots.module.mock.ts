import { Module } from '@nestjs/common';
import { GetParrotNameRequestHandler } from './get-cat-name-request/get-parrot-name.request.handler';

@Module({
  providers: [GetParrotNameRequestHandler],
  exports: [GetParrotNameRequestHandler],
})
export class ParrotsModuleMock {}
