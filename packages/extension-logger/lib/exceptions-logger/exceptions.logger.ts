export interface ExceptionsLogger {
  log<TException extends Error>(exceptions: TException, msg: string): void;
}
