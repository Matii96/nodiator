import { Type } from '../../utils/type.interface';

export interface IMessageTypeProvider {
  metadata: any;
  provider: Type<any>;
}
