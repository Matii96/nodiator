import { Module } from '@nestjs/common';
import { MediatorModule } from '../../../lib';
import { ParrotsModuleMock } from './parrots/parrots.module.mock';

@Module({
  imports: [MediatorModule.forFeature(BirdsModuleMock), ParrotsModuleMock],
  exports: [MediatorModule],
})
export class BirdsModuleMock {}
