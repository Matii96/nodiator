import { ResponseType } from './constants';

export type GetResponseType<Request extends { [k: PropertyKey]: any }> = Request[typeof ResponseType] extends
  | undefined
  | void
  ? Request[typeof ResponseType]
  : Request[typeof ResponseType] extends object
  ? NonNullable<Request[typeof ResponseType]>
  : unknown;
