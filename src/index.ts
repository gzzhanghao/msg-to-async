import { AsyncMsg, CallMsg, ResMsg } from './shared/protocol';
import { genReqId } from './shared/util';

export interface ClientOptions {
  sendMessage(msg: AsyncMsg): void;
  handleInvoke(param: unknown, extra?: unknown): unknown;
}

interface MessageHandle {
  resolve(result: unknown): void;
  reject(reason: unknown): void;
}

export function create<TReq>(options: ClientOptions) {
  const requestMap = new Map<string, MessageHandle>();

  async function invoke<T>(param: TReq): Promise<T> {
    return new Promise((resolve, reject) => {
      const reqId = genReqId();
      requestMap.set(reqId, { resolve, reject });
      options.sendMessage({
        type: 'call',
        reqId,
        param,
      });
    });
  }

  function handleMessage(msg: AsyncMsg, extra?: unknown) {
    switch (msg.type) {
      case 'call':
        return handleCallMsg(msg, extra);
      case 'res':
        return handleResMsg(msg);
    }
  }

  async function handleCallMsg(msg: CallMsg, extra?: unknown) {
    try {
      options.sendMessage({
        type: 'res',
        reqId: msg.reqId,
        kind: 'resolve',
        param: await options.handleInvoke(msg.param, extra),
      });
    } catch (error) {
      options.sendMessage({
        type: 'res',
        reqId: msg.reqId,
        kind: 'reject',
        param: error,
      });
      throw error;
    }
  }

  function handleResMsg(msg: ResMsg) {
    const handle = requestMap.get(msg.reqId);
    if (!handle) {
      return;
    }
    handle[msg.kind](msg.param);
    requestMap.delete(msg.reqId);
  }

  return {
    invoke,
    handleMessage,
  };
}
