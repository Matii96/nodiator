import { Module } from '@nestjs/common';
import { MediatorModule } from '../../../lib';
import { CatsService } from './cats.service';
import { GetCatNameRequestHandler } from './get-cat-name-request/get-cat-name.request.handler';

@Module({
  imports: [MediatorModule.forFeature(CatsModuleMock)],
  providers: [CatsService, GetCatNameRequestHandler],
  exports: [MediatorModule],
})
export class CatsModuleMock {}
