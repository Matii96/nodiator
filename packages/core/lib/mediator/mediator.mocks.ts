import { Observable } from 'rxjs';
import { MessageProcessing } from '../executor';
import { ProvidersManagerMock } from '../providers-manager/providers-manager.mocks';
import { Mediator } from './mediator';

export class MediatorMock implements Mediator {
  providers = new ProvidersManagerMock();
  bus = new Observable<MessageProcessing>();

  use = jest.fn();
  request = jest.fn();
  publish = jest.fn();
}
