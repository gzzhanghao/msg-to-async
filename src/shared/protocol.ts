export type AsyncMsg = CallMsg | ResMsg;

export interface CallMsg {
  type: 'call';
  reqId: string;
  param: unknown;
}

export interface ResMsg {
  type: 'res';
  reqId: string;
  kind: 'resolve' | 'reject';
  param: unknown;
}
