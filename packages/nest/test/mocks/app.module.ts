import { Module } from '@nestjs/common';
import { MediatorModule } from '../../lib';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [MediatorModule.forRoot({}), CatsModule],
})
export class AppModule {}
