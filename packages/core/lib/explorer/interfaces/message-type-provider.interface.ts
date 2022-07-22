import { Type } from '@nestjs/common';

export interface IMessageTypeProvider {
  metadata: any;
  provider: Type<any>;
}
