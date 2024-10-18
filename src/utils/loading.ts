import {ElLoading} from "element-plus";

export const show = function (text: string = "Loading...", timeout: number = 0) {
// 展示 Loading 效果
  const view = ElLoading.service({lock: true, text});
  if (timeout > 0) {
    setTimeout(() => {
      view.close();
    }, timeout);
  }
  return view;
}

const loading = function (timeout: number = 300) {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    const app = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      // 展示 Loading 效果
      const view = show();
      try {
        // 执行原逻辑
        return await app.apply(self, args);
      } catch (e) {
        return Promise.reject(e);
      } finally {
        setTimeout(() => {
          view.close();
        }, timeout);
      }
    }
  };
}
export default loading;