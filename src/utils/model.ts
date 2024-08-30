/**
 * @file 接口装饰器
 * @author svon.me@gmail.com
 */

import * as _ from "lodash-es";
import {useAsyncState} from "@vueuse/core";
import safeGet from "@fengqiaogang/safe-get";
import type {UseAsyncStateReturn} from "@vueuse/core";

/**
 * 分页查询统一结果
 */
export class PageResult<T = object> {
  results: T[];   // 列表数据
  total: number;  // 总数量
  constructor(res: object | T[] = [], total: number = 0) {
    if (res && Array.isArray(res)) {
      this.results = Array.isArray(res) ? res : [res];
      this.total = Math.max(this.results.length, total);
    } else if (res && typeof res === "object") {
      if (_.hasIn(res, "rows")) {
        this.results = safeGet<T[]>(res, "rows") || [];
      } else if (_.hasIn(res, "results")) {
        this.results = safeGet<T[]>(res, "results") || [];
      } else if (_.hasIn(res, "items")) {
        this.results = safeGet<T[]>(res, "items") || [];
      } else {
        this.results = [res as T];
      }
      if (_.hasIn(res, "total")) {
        this.total = safeGet<number>(res, "total")!;
      } else {
        this.total = Math.max(safeGet<number>(res, "total") || 0, this.results.length, total);
      }
    } else {
      this.results = [];
      this.total = 0;
    }
  }

  get items(): T[] {
    return this.results;
  }

  forEach(callback: (v: T) => void) {
    if (callback) {
      for (const value of this.results) {
        callback(value);
      }
    }
  }
}

export type UseResult<T = object> = UseAsyncStateReturn<T, any, true>;
export type UsePageResult<T = object> = UseAsyncStateReturn<PageResult<T>, any, true>;

/**
 * 用于获取对象
 * @param api           请求逻辑
 * @param initialState  初始值
 * @param execute       是否默认加载, 默认不加载
 * @param callback      回调方法, 对数据进行校验或者转换
 * @returns
 */
export const result = function <T>(api: (...args: any[]) => T | Promise<T>, initialState?: T, execute?: boolean, callback?: (value: any) => T) {
  const app = async function (...args: any[]) {
    if (callback) {
      const value = await api(...args);
      return callback(value);
    }
    return api(...args);
  }
  const option = {
    delay: 100,
    immediate: !!execute,
    resetOnExecute: false,
  }
  // @ts-ignore
  return useAsyncState<T>(app, initialState, option);
}
/**
 * 用于获取列表数据
 * @param api           请求逻辑
 * @param initialState  初始值
 * @param execute       是否默认加载, 默认不加载
 * @returns
 */
export const list = function <T = object>(api: (...args: any[]) => PageResult<T> | Promise<PageResult<T>>, initialState?: PageResult<T>, execute?: boolean) {
  const callback = function (value: any) {
    if (_.isNil(value) || value === false || !value) {
      return new PageResult<T>();
    }
    return new PageResult<T>(value);
  }
  return result<PageResult<T>>(api, initialState || new PageResult<T>(), execute, callback);
}

// 用于接口, 以装饰器方式使用
export const useResult = function <T = object>(initialState?: T, execute?: boolean, callback?: (value: any) => T) {
  return function (_target: any, _methodName: string, descriptor: PropertyDescriptor) {
    const api = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const self = this;
      const app = function (...query: any[]) {
        const params: Array<any> = [];
        if (query.length < 1 && execute) {
          params.push(...args);
        } else {
          params.push(...query);
        }
        return api.apply(self, params);
      }
      // @ts-ignore
      return result(app, initialState, execute, callback);
    };
  };
}

// 用于接口, 以装饰器方式使用
export const useList = function <T = object>(initialState?: PageResult<T>, execute?: boolean) {
  const callback = function (value: any) {
    if (_.isNil(value) || value === false || !value) {
      return new PageResult<T>();
    }
    return new PageResult<T>(value);
  }
  return useResult<PageResult<T>>(initialState || new PageResult<T>(), execute, callback);
}