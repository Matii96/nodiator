import { ResponseType } from './constants';

export type GetResponseType<Request extends { [k: PropertyKey]: any }> = Request[typeof ResponseType] extends void
  ? void
  : Request[typeof ResponseType] extends object | undefined
  ? NonNullable<Request[typeof ResponseType]>
  : unknown;
