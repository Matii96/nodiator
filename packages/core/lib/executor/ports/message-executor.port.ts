import { IMessage } from '../../messages/interfaces/message.interface';

export interface IMessageExecutor<TMessage extends IMessage, TResult> {
  execute(id: string, message: TMessage): Promise<TResult>;
}
