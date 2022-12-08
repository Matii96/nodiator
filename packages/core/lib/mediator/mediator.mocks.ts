import { Observable } from 'rxjs';
import { IMessageProcessing } from '../executor';
import { ProvidersManagerMock } from '../providers-manager/providers-manager.mocks';
import { IMediator } from './ports';

export class MediatorMock implements IMediator {
  providers = new ProvidersManagerMock();
  bus = new Observable<IMessageProcessing>();

  use = jest.fn();
  request = jest.fn();
  publish = jest.fn();
}
