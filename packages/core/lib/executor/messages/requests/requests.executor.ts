import { Observable } from 'rxjs';
import { Request } from '../../../messages';
import { MessageExecutor } from '../shared/message-executor';

export interface RequestsExecutor extends MessageExecutor<Request, Observable<any>> {}
