import { Observable } from 'rxjs';
import { Request } from '../../../../messages';
import { MessageExecutor } from '../../../ports/message-executor.port';

export interface RequestsExecutor extends MessageExecutor<Request, Observable<any>> {}
