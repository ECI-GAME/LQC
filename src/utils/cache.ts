type Callback = (error?: Error, value?: object) => void;

const uuid = function(value: any): string {
  return JSON.stringify(value);
}

/**
 * 缓存
 * @param timeout 缓存时间[ms], 多长时间后自动清除, 等于 0 时长久缓存
 * @returns 
 */
const cache = function(timeout: number = 0) {
  const map = new Map<string, object>();
  const hook = new Map<string, Callback[]>();

  const hookPush = function(key: string, callback: Callback) {
    const list = hook.get(key);
    if (list && list.length > 0) {
      hook.set(key, [...list, callback]);
    } else {
      hook.set(key, [callback]);
    }
  }
  const hookCallback = function(key: string, error?: Error, value?: object) {
    const list = hook.get(key);
    hook.delete(key);
    if (list) {
      for (const callback of list) {
        callback(error, value);
      }
    }
  }

  const task = async function(key: string, get: () => Promise<object>, callback: Callback) {
    if (hook.has(key)) {
      hookPush(key, callback);
      return;
    }
    hookPush(key, callback);
    try {
      const value = await get();
      map.set(key, value);
      if (timeout > 0) {
        setTimeout(() => map.delete(key), timeout);
      }
      hookCallback(key, void 0, value);
    } catch (error) {
      hookCallback(key, error as Error);
    }
  };
  const main = async function(key: string, get: () => Promise<object>) {
    if (map.has(key)) {
      return map.get(key);
    }
    return new Promise(function(resolve, reject) {
      task(key, get, function(error?: Error, value?: object) {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      });
    });
  };
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    const app = descriptor.value;
    descriptor.value = function(...args: any[]) {
      const self = this;
      const get = function() {
        return Promise.resolve(app.apply(self, args));
      };
      return main(uuid(args), get);
    }
  };
}


export default cache;