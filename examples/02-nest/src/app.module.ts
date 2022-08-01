import { Module } from '@nestjs/common';
import { MediatorModule } from '@nodiator/nest';
import { CatsModule } from './cats/cats.module';
import { Namespaces } from './namespaces.enum';

@Module({
  imports: [MediatorModule.forRoot({ namespace: Namespaces.CATS }), CatsModule],
})
export class AppModule {}
