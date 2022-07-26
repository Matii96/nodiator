import { IMessage } from '../../messages/interfaces/message.interface';

export interface IMessageExecutor<TMessage extends IMessage, TResult> {
  execute(message: TMessage): Promise<TResult>;
}
