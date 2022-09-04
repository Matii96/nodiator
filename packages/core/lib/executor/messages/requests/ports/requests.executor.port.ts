import { Observable } from 'rxjs';
import { IRequest } from '../../../../messages';
import { IMessageExecutor } from '../../../ports/message-executor.port';

export interface IRequestsExecutor extends IMessageExecutor<IRequest, Observable<any>> {}
