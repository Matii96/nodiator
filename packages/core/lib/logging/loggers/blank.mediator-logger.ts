import { IMediatorLogger } from '../../mediator/mediator.options';

export class BlankMediatorLogger implements IMediatorLogger {
  debug() {}
  info() {}
  warn() {}
  error() {}
}
