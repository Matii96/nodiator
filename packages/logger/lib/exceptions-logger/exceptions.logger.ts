import { MediatorLoggingLevels } from '../logging-level/logging-levels.enum';
import { IMediatorLogger } from '../mediator-logger/mediator-logger.port';
import { ClassConstructor } from '../utils/class-constructor.interface';
import { ExceptionsLoggingLevels } from './exceptions.logger.options';
import { IExceptionsLogger } from './exceptions.logger.port';

export class ExceptionsLogger implements IExceptionsLogger {
  private readonly _levelsDict: Record<MediatorLoggingLevels, (msg: string) => void>;
  private readonly _loggingLevelsMap = new Map<ClassConstructor<Error>, MediatorLoggingLevels>();

  constructor(private readonly _logger: IMediatorLogger, exceptionsLoggingLevels: ExceptionsLoggingLevels = {}) {
    this._levelsDict = {
      [MediatorLoggingLevels.DEBUG]: this._logger.debug.bind(this._logger),
      [MediatorLoggingLevels.INFO]: this._logger.info.bind(this._logger),
      [MediatorLoggingLevels.WARN]: this._logger.warn.bind(this._logger),
      [MediatorLoggingLevels.ERROR]: this._logger.error.bind(this._logger),
      [MediatorLoggingLevels.NONE]: () => undefined,
    };

    for (const [level, exceptionsTypes] of Object.entries(exceptionsLoggingLevels))
      for (const exceptionType of exceptionsTypes)
        this._loggingLevelsMap.set(exceptionType, level as MediatorLoggingLevels);
  }

  log<TException extends Error>(exception: TException, msg: string) {
    const logLevel = this.getLogLevel(exception.constructor as ClassConstructor<TException>);
    return this._levelsDict[logLevel](msg);
  }

  private getLogLevel<TException extends Error>(exceptionType: ClassConstructor<TException>): MediatorLoggingLevels {
    if (exceptionType === Object.prototype) return MediatorLoggingLevels.ERROR;
    const mappedException = this._loggingLevelsMap.get(exceptionType);
    return mappedException ?? this.getLogLevel(Object.getPrototypeOf(exceptionType));
  }
}
