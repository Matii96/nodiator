import { IMediatorLogger } from '../../mediator.options';

export class BlankMediatorLogger implements IMediatorLogger {
  debug() {}
  info() {}
  warn() {}
  error() {}
}
