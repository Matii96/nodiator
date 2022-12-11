export interface IExceptionsLogger {
  log<TException extends Error>(exceptions: TException, msg: string): void;
}
