/**
 * @file 异步组件
 * @author svon.me@gmail.com
 */

import {defineAsyncComponent} from "vue";

import type {AsyncComponentLoader} from "vue";

const lazyload = function <T>(value: AsyncComponentLoader<T>, delay?: number) {
  if (delay) {
    return defineAsyncComponent({
      delay,
      loader: value as any,
    });
  }
  return defineAsyncComponent({
    loader: value as any,
  });
};

export default lazyload;